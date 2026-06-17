import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Modal, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { useStore } from '../../services/store';
import { SCENARIOS, SceneId, Difficulty, getRandomPrompt } from '../../services/scenarios';
import { transcribeAudio, analyzeTranscript, chatWithAI, hasAI, hasSTT } from '../../services/api';
import { analyzeSpeech } from '../../services/analyzer';
import * as backend from '../../services/backend';
import * as Speech from 'expo-speech';

const { width: W } = Dimensions.get('window');
const PINK = '#e8927f';
const PINK_SOFT = '#fbe4dc';
const CREAM = '#fdf2ec';
const INK = '#3d3028';
const SUB = '#7a6a5e';
const MUTED = '#b8a89a';
const RED = '#e57373';
const WHITE = '#ffffff';

const DIFFS: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
const DIFF_L: Record<Difficulty, string> = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };

const SCENES: { id: SceneId; icon: string; label: string; name: string }[] = [
  { id: 'daily',       icon: '☕', label: 'Daily English',    name: '日常' },
  { id: 'business',    icon: '💼', label: 'Business English', name: '商務' },
  { id: 'ielts',       icon: '📝', label: 'IELTS Speaking',   name: '雅思' },
  { id: 'restaurant',  icon: '🍽️', label: 'Restaurant',       name: '餐廳' },
  { id: 'interview',   icon: '🤵', label: 'Interview',        name: '面試' },
  { id: 'dating',      icon: '💕', label: 'Dating',           name: '約會' },
  { id: 'doctor',      icon: '🩺', label: 'Doctor Visit',     name: '醫生' },
  { id: 'ted',         icon: '🎤', label: 'TED Talk',         name: '演講' },
];

interface Msg { role: 'ai'|'user'; text: string; score?: number; level?: string; bars?: {fluency:number;vocabulary:number;grammar:number} }

export default function ChatScreen() {
  const { state, dispatch } = useStore();
  const [scene, setScene] = useState<SceneId>(state.scene);
  const [diff, setDiff] = useState<Difficulty>(state.difficulty);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [lastAudioUri, setLastAudioUri] = useState<string | null>(null);
  const recRef = useRef<Audio.Recording | null>(null);
  const pulse = useRef(new Animated.Value(1)).current;
  const scrollRef = useRef<ScrollView>(null);
  const aiOk = hasAI() || hasSTT() || !!state.account.loggedIn;

  const currentScene = SCENES.find(s => s.id === scene) || SCENES[0];

  useEffect(() => { dispatch({ type: 'SET_SCENE', payload: scene }); }, [scene]);
  useEffect(() => { dispatch({ type: 'SET_DIFFICULTY', payload: diff }); }, [diff]);
  useEffect(() => {
    if (recording) {
      Animated.loop(Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 500, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])).start();
    } else pulse.setValue(1);
  }, [recording]);

  const scrollDown = () => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

  const pickScene = (s: SceneId) => { setScene(s); setPickerOpen(false); };

  const analyze = async (input: string) => {
    if (!input.trim()) return;
    setMsgs(prev => [...prev, { role: 'user', text: input }]);
    setLoading(true); setShowInput(false); scrollDown();
    try {
      // Prefer backend (Minimax) when logged in; fallback to local DeepSeek API.
      const useBackend = !!state.account.loggedIn;
      const [analysis, chat] = await Promise.all([
        aiOk
          ? (useBackend
              ? backend.aiAnalyze({ transcript: input, scene: SCENARIOS[scene].nameEn, scores: {}, locale: state.account.locale }).catch(() => null)
              : analyzeTranscript(input).catch(() => null))
          : null,
        aiOk
          ? (useBackend
              ? backend.aiChat({ messages: [{ role: 'user', content: input }], scene: SCENARIOS[scene].nameEn, locale: state.account.locale, level: diff }).then((r: any) => ({ reply: r.content, followUpPrompt: '', corrections: [], encouragement: '' })).catch(() => null)
              : chatWithAI(input, { scene: SCENARIOS[scene].nameEn, difficulty: diff }).catch(() => null))
          : null,
      ]);
      const r = analyzeSpeech(input);
      if (analysis && analysis.content) {
        // Parse backend's structured response (JSON) into a score boost.
        try {
          const parsed = JSON.parse(analysis.content);
          if (parsed.overall?.score) r.overall.score = parsed.overall.score;
          if (parsed.overall?.level) r.overall.level = parsed.overall.level;
        } catch {
          // not JSON — keep local scores
        }
      }
      dispatch({ type: 'ADD_ANALYSIS', payload: r });
      dispatch({ type: 'ADD_XP', payload: 10 + Math.floor(r.overall.score / 10) });
      const reply = (chat && chat.reply) || 'Great! Keep going!';
      setMsgs(prev => [...prev, { role: 'ai', text: reply, score: r.overall.score, level: r.overall.level, bars: { fluency: r.fluency.score, vocabulary: r.vocabulary.score, grammar: r.grammar.score } }]);
      Speech.speak(reply, { language: 'en', rate: 0.85 });
    } catch {
      setMsgs(prev => [...prev, { role: 'ai', text: 'Sorry, try again!' }]);
    } finally { setLoading(false); }
  };

  const startRec = useCallback(async () => {
    setRecording(true);
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
      recRef.current = rec;
    } catch { setRecording(false); setShowInput(true); }
  }, []);

  const stopRec = useCallback(async () => {
    setRecording(false);
    if (!recRef.current) { setShowInput(true); return; }
    try {
      await recRef.current.stopAndUnloadAsync();
      const uri = recRef.current.getURI();
      recRef.current = null;
      if (!uri) { setShowInput(true); return; }

      // Try backend STT (Minimax doesn't do STT, so this falls back to expo-speech).
      // For now: always pop text input so the user can type what they said.
      // If we later add STT to backend, this branch will auto-use it.
      setShowInput(true);
      // Optionally save the audio URI so user can replay or upload
      setLastAudioUri(uri);
    } catch { setShowInput(true); }
  }, [scene, diff]);

  const submitText = () => { if (textInput.trim()) { analyze(textInput.trim()); setTextInput(''); } };

  return (
    <KeyboardAvoidingView style={st.root} behavior={Platform.OS==='ios'?'padding':undefined}>
      {/* Header row: title + scene picker button */}
      <View style={st.head}>
        <Text style={st.title}>English Coach</Text>
        <Pressable style={st.pickerBtn} onPress={() => setPickerOpen(true)}>
          <Text style={st.pickerIcon}>{currentScene.icon}</Text>
          <Text style={st.pickerLabel}>{currentScene.label}</Text>
          <Text style={st.pickerArrow}>▼</Text>
        </Pressable>
      </View>

      {/* Scene picker modal */}
      <Modal visible={pickerOpen} transparent animationType="fade" onRequestClose={() => setPickerOpen(false)}>
        <Pressable style={st.backdrop} onPress={() => setPickerOpen(false)}>
          <Pressable style={st.pickerCard} onPress={e => e.stopPropagation()}>
            <Text style={st.pickerTitle}>Choose a scene · 揀場景</Text>
            <View style={st.pickerGrid}>
              {SCENES.map(s => (
                <Pressable
                  key={s.id}
                  style={[st.pickerItem, scene===s.id&&st.pickerItemOn]}
                  onPress={() => pickScene(s.id)}
                >
                  <Text style={st.pickerItemIcon}>{s.icon}</Text>
                  <Text style={[st.pickerItemLabel, scene===s.id&&st.pickerItemLabelOn]}>{s.label}</Text>
                  <Text style={st.pickerItemName}>{s.name}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <ScrollView ref={scrollRef} style={st.body} contentContainerStyle={st.bodyC} keyboardShouldPersistTaps="handled">
        {msgs.length === 0 && (
          <View style={st.greetCard}>
            <Text style={st.greetTxt}>Let's practice <Text style={{fontWeight:'800',color:PINK}}>{SCENARIOS[scene].nameEn}</Text></Text>
            <Text style={st.greetPrompt}>{getRandomPrompt(scene, diff).en}</Text>
          </View>
        )}

        {msgs.map((m, i) => (
          <View key={i} style={{gap:8}}>
            <View style={[st.bubble, m.role==='user'?st.bubbleUser:st.bubbleAI]}>
              <Text style={[st.bubbleTxt, m.role==='user'&&st.bubbleTxtUser]}>{m.text}</Text>
            </View>
            {m.score !== undefined && (
              <View style={st.scoreBar}>
                <Text style={st.scoreNum}>{m.score}</Text>
                <View style={st.scoreBars}>
                  {m.bars && (['fluency','vocabulary','grammar'] as const).map(k => (
                    <View key={k} style={st.scoreRow}>
                      <Text style={st.scoreLabel}>{k}</Text>
                      <View style={st.scoreBg}><View style={[st.scoreFill,{width:`${(m.bars?.[k] ?? 0)}%`}]}/></View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        ))}

        {loading && <ActivityIndicator color={PINK} style={{padding:20}}/>}
        <View style={{height:160}}/>
      </ScrollView>

      <View style={st.bottom}>
        {!showInput && !loading && (
          <>
            <View style={st.diffRow}>
              {DIFFS.map(d => (
                <Pressable key={d} style={[st.diffBtn, diff===d&&st.diffBtnOn]} onPress={()=>setDiff(d)}>
                  <Text style={[st.diffTxt, diff===d&&st.diffTxtOn]}>{DIFF_L[d]}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable style={[st.recBtn, recording&&st.recBtnOn]} onPressIn={startRec} onPressOut={stopRec}>
              <Animated.View style={[st.recInner,{transform:[{scale:pulse}]}]}>
                <Text style={st.recIcon}>{recording?'🔴':'🎤'}</Text>
              </Animated.View>
            </Pressable>
            <Text style={st.recHint}>Hold to speak · 按住講</Text>
          </>
        )}
        {showInput && !loading && (
          <View style={st.inputRow}>
            <TextInput style={st.input} value={textInput} onChangeText={setTextInput} placeholder="Type what you said..." placeholderTextColor={MUTED} multiline autoFocus />
            <Pressable style={[st.sendBtn,!textInput.trim()&&st.sendOff]} onPress={submitText} disabled={!textInput.trim()}>
              <Text style={st.sendTxt}>↑</Text>
            </Pressable>
          </View>
        )}
        {loading && <Text style={st.loadingTxt}>Analyzing...</Text>}
      </View>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  root: { flex:1, backgroundColor:CREAM },
  head: { paddingTop:56, paddingHorizontal:16, paddingBottom:12, backgroundColor:PINK },
  title: { fontSize:24, fontFamily:'Nunito_800ExtraBold', color:'#ffffff' },

  // Picker button — long pill
  pickerBtn: { flexDirection:'row', alignItems:'center', alignSelf:'stretch', justifyContent:'center', gap:6, backgroundColor:PINK_SOFT, paddingHorizontal:16, paddingVertical:10, borderRadius:24, borderWidth:1.5, borderColor:PINK },
  pickerIcon: { fontSize:16 },
  pickerLabel: { fontSize:13, fontWeight:'700', color:PINK },
  pickerArrow: { fontSize:10, color:PINK, marginLeft:2 },

  // Picker modal
  backdrop: { flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', paddingHorizontal:24 },
  pickerCard: { backgroundColor:WHITE, borderRadius:24, padding:20 },
  pickerTitle: { fontSize:15, fontWeight:'800', color:INK, textAlign:'center', marginBottom:16 },
  pickerGrid: { gap:8 },
  pickerItem: { flexDirection:'row', alignItems:'center', gap:12, paddingVertical:14, paddingHorizontal:16, borderRadius:16, backgroundColor:CREAM },
  pickerItemOn: { backgroundColor:PINK_SOFT, borderWidth:1.5, borderColor:PINK },
  pickerItemIcon: { fontSize:24, width:36, textAlign:'center' },
  pickerItemLabel: { fontSize:14, fontWeight:'700', color:INK, flex:1 },
  pickerItemLabelOn: { color:PINK },
  pickerItemName: { fontSize:11, color:MUTED, fontWeight:'600' },

  body: { flex:1 },
  bodyC: { padding:16, gap:12 },
  greetCard: { backgroundColor:WHITE, borderRadius:18, borderBottomLeftRadius:4, padding:16, maxWidth:'85%' },
  greetTxt: { fontSize:14, color:INK, lineHeight:22 },
  greetPrompt: { fontSize:13, color:PINK, marginTop:8, fontStyle:'italic' },
  bubble: { maxWidth:'85%', borderRadius:18, padding:14 },
  bubbleAI: { backgroundColor:WHITE, borderBottomLeftRadius:4, alignSelf:'flex-start' },
  bubbleUser: { backgroundColor:PINK, borderBottomRightRadius:4, alignSelf:'flex-end' },
  bubbleTxt: { fontSize:14, color:INK, lineHeight:22 },
  bubbleTxtUser: { color:WHITE },
  scoreBar: { flexDirection:'row', gap:12, backgroundColor:PINK_SOFT, borderRadius:14, padding:12, alignItems:'center' },
  scoreNum: { fontSize:32, fontFamily:'Nunito_800ExtraBold', color:PINK, width:40, textAlign:'center' },
  scoreBars: { flex:1, gap:4 },
  scoreRow: { flexDirection:'row', alignItems:'center', gap:6 },
  scoreLabel: { fontSize:10, color:SUB, width:60, fontWeight:'600' },
  scoreBg: { flex:1, height:6, backgroundColor:'rgba(255,255,255,0.6)', borderRadius:3, overflow:'hidden' },
  scoreFill: { height:'100%', backgroundColor:PINK, borderRadius:3 },
  bottom: { backgroundColor:WHITE, paddingTop:12, paddingBottom:30, alignItems:'center', borderTopWidth:1, borderColor:'#f0e0d0' },
  diffRow: { flexDirection:'row', gap:6, marginBottom:12 },
  diffBtn: { paddingHorizontal:14, paddingVertical:6, borderRadius:12, backgroundColor:CREAM },
  diffBtnOn: { backgroundColor:PINK },
  diffTxt: { fontSize:11, color:SUB, fontWeight:'600' },
  diffTxtOn: { color:WHITE },
  recBtn: { width:72, height:72, borderRadius:36, backgroundColor:PINK, alignItems:'center', justifyContent:'center', shadowColor:PINK, shadowOffset:{width:0,height:4}, shadowOpacity:0.35, shadowRadius:8, elevation:8 },
  recBtnOn: { backgroundColor:RED },
  recInner: { width:58, height:58, borderRadius:29, backgroundColor:WHITE, alignItems:'center', justifyContent:'center' },
  recIcon: { fontSize:28 },
  recHint: { fontSize:11, color:MUTED, marginTop:8 },
  inputRow: { flexDirection:'row', gap:10, paddingHorizontal:16, alignItems:'flex-end' },
  input: { flex:1, backgroundColor:CREAM, borderRadius:20, paddingHorizontal:16, paddingVertical:12, fontSize:15, color:INK, maxHeight:100 },
  sendBtn: { width:46, height:46, borderRadius:23, backgroundColor:PINK, alignItems:'center', justifyContent:'center' },
  sendOff: { opacity:0.4 },
  sendTxt: { color:WHITE, fontSize:20, fontWeight:'800' },
  loadingTxt: { fontSize:13, color:PINK, fontWeight:'700', paddingVertical:20 },
});
