import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Pressable, Animated, TextInput, Dimensions, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { useStore } from '../../services/store';
import { SCENARIOS, SceneId, Difficulty, getRandomPrompt } from '../../services/scenarios';
import { getRandomEmotion } from '../../services/emotions';
import { transcribeAudio, analyzeTranscript, chatWithAI, hasAI, hasSTT, AIChatResponse } from '../../services/api';
import { analyzeSpeech, AnalysisResult } from '../../services/analyzer';
import WordPickerModal from '../../components/WordPickerModal';
import * as Speech from 'expo-speech';
import * as backend from '../../services/backend';

const F = { fontFamily: 'Nunito_400Regular' };
const FB = { fontFamily: 'Nunito_700Bold' };
const FX = { fontFamily: 'Nunito_800ExtraBold' };

const PINK = '#e8927f';
const PINK_SOFT = '#fbe4dc';
const CREAM = '#fdf2ec';
const INK = '#3d3028';
const SUBINK = '#7a6a5e';
const MUTED = '#b8a89a';

const SCENES: { id: SceneId; icon: string; name: string; nameEn: string }[] = [
  { id: 'business', icon: '💼', name: '商務 Business', nameEn: 'Business English' },
  { id: 'ielts', icon: '📝', name: '雅思 IELTS', nameEn: 'IELTS' },
  { id: 'daily', icon: '☕', name: '日常 Daily', nameEn: 'Daily English' },
  { id: 'restaurant', icon: '🍽️', name: '餐廳 Restaurant', nameEn: 'Restaurant' },
  { id: 'interview', icon: '🤵', name: '面試 Interview', nameEn: 'Interview' },
  { id: 'dating', icon: '💕', name: '約會 Dating', nameEn: 'Dating' },
  { id: 'doctor', icon: '🩺', name: '醫生 Doctor', nameEn: 'Doctor' },
  { id: 'ted', icon: '🎤', name: 'TED 演講', nameEn: 'TED Talk' },
];

const DIFFS: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
const DIFF_L: Record<Difficulty, string> = { beginner: '初級', intermediate: '中級', advanced: '高級' };

interface ChatMessage { role: 'ai' | 'user'; text: string; }

export default function ChatScreen() {
  const { state, dispatch } = useStore();
  const router = useRouter();
  const [picker, setPicker] = useState(false);
  const [prompt, setPrompt] = useState(() => getRandomPrompt(state.scene, state.difficulty));
  const [text, setText] = useState('');
  const [recording, setRecording] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [emotion, setEmotion] = useState<{ zh: string; en: string } | null>(null);
  const [msg, setMsg] = useState('');
  const [transcript, setTranscript] = useState('');
  const [wordContext, setWordContext] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [aiResponse, setAiResponse] = useState<AIChatResponse | null>(null);
  const pulse = useRef(new Animated.Value(1)).current;
  const scroll = useRef<ScrollView>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const initialMount = useRef(true);
  const scene = SCENARIOS[state.scene];
  const aiAvailable = hasAI();

  useEffect(() => {
    if (initialMount.current) { initialMount.current = false; return; }
    if (recording || showInput || analysis || transcript || loading) {
      setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [recording, showInput, analysis, transcript, loading]);

  useEffect(() => {
    if (recording) {
      const a = Animated.loop(Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]));
      a.start();
      return () => a.stop();
    }
    pulse.setValue(1);
  }, [recording]);

  const pick = (s: SceneId) => { dispatch({ type: 'SET_SCENE', payload: s }); setPicker(false); reset(); };
  const diff = (d: Difficulty) => { dispatch({ type: 'SET_DIFFICULTY', payload: d }); reset(); };
  const reset = () => {
    setText(''); setAnalysis(null); setEmotion(null); setMsg(''); setShowInput(false); setTranscript('');
    setAiResponse(null); setChatHistory([]);
    setPrompt(getRandomPrompt(state.scene, state.difficulty));
  };

  // ---- Real AI analysis ----
  const runAnalysis = async (input: string) => {
    if (!input.trim()) return;
    setTranscript(input);
    setLoading(true);
    setShowInput(false);
    setChatHistory(prev => [...prev, { role: 'user', text: input }]);

    try {
      if (aiAvailable) {
        // Real AI: analysis + chat response in parallel
        const [aiResult, chatResult] = await Promise.all([
          analyzeTranscript(input).catch(() => null),
          chatWithAI(input, {
            scene: scene.nameEn,
            difficulty: state.difficulty,
            history: chatHistory.map(m => m.text),
          }).catch(() => null),
        ]);

        if (aiResult) {
          const words = input.toLowerCase().match(/\b[a-z]+\b/g) || [];
          const uniqueSet = new Set(words);
          const r: AnalysisResult = {
            overall: { score: aiResult.overall.score, level: aiResult.overall.level, detail: aiResult.overall.detail },
            fluency: { score: aiResult.fluency.score, wpm: 0, fillerRatio: 0, detail: aiResult.fluency.detail },
            vocabulary: { score: aiResult.vocabulary.score, totalWords: words.length, uniqueWords: uniqueSet.size, ttr: words.length > 0 ? uniqueSet.size / words.length : 0, cefrLevels: {}, sceneVocabUsed: 0, detail: aiResult.vocabulary.detail },
            pronunciation: { score: aiResult.pronunciation.score, avgConfidence: 0, detail: aiResult.pronunciation.detail },
            grammar: { score: aiResult.grammar.score, avgSentenceLength: 0, sentenceCount: 0, errorCount: 0, passiveCount: 0, detail: aiResult.grammar.detail },
            timestamp: Date.now(),
            transcript: input,
          };
          setAnalysis(r);
          dispatch({ type: 'ADD_ANALYSIS', payload: r });
          dispatch({ type: 'ADD_XP', payload: 10 + Math.floor(r.overall.score / 10) });
          setMsg(`${r.overall.score}/100 · ${r.overall.level}`);
          // Sync to backend if logged in
          if (state.account.loggedIn) {
            backend.syncUserState({ ...state, analysisHistory: [...state.analysisHistory, r] }).catch(() => {});
          }
        }

        if (chatResult) {
          setAiResponse(chatResult);
          setChatHistory(prev => [...prev, { role: 'ai', text: chatResult.reply }]);
          Speech.speak(chatResult.reply, { language: 'en', rate: 0.85 });
        } else {
          Speech.speak(aiResult?.overall.detail || 'Good job!', { language: 'en', rate: 0.85 });
        }
      } else {
        // Fallback: local analysis
        const r = analyzeSpeech(input);
        setAnalysis(r);
        dispatch({ type: 'ADD_ANALYSIS', payload: r });
        dispatch({ type: 'ADD_XP', payload: 10 + Math.floor(r.overall.score / 10) });
        setMsg(`${r.overall.score}/100 · ${r.overall.level} (offline)`);
        if (state.account.loggedIn) {
          backend.syncUserState({ ...state, analysisHistory: [...state.analysisHistory, r] }).catch(() => {});
        }
        Speech.speak(r.overall.detail || 'Good job!', { language: 'en', rate: 0.85 });
      }
    } catch (e: any) {
      setMsg(`Error: ${e.message?.slice(0, 60) || 'Something went wrong'}`);
    } finally {
      setLoading(false);
      setEmotion(getRandomEmotion('complete'));
    }
  };

  // ---- Real audio recording ----
  const startRecording = useCallback(async () => {
    if (!hasSTT() && !aiAvailable) {
      // No STT configured — fall back to typing
      setRecording(true); setText(''); setAnalysis(null); setShowInput(false);
      setEmotion(getRandomEmotion('start'));
      setMsg('🎤 大聲說出來！Speak out loud! (typing fallback)');
      return;
    }

    setRecording(true);
    setText(''); setAnalysis(null); setShowInput(false);
    setEmotion(getRandomEmotion('start'));
    setMsg('🎤 錄音中... Recording...');

    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
      recordingRef.current = rec;
    } catch (e: any) {
      setMsg(`Mic error: ${e.message?.slice(0, 50)}`);
      setRecording(false);
      setShowInput(true);
    }
  }, [aiAvailable]);

  const stopRecording = useCallback(async () => {
    setRecording(false);

    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        recordingRef.current = null;

        if (uri && hasSTT()) {
          setMsg('🤖 辨識緊你講嘅嘢... Transcribing...');
          setLoading(true);

          const transcriptText = await transcribeAudio(uri);
          setTranscript(transcriptText);
          setText(transcriptText);

          // Auto-analyze after transcription
          await runAnalysis(transcriptText);
          return;
        }
      } catch (e: any) {
        setMsg(`Recording error: ${e.message?.slice(0, 50)}`);
      }
    }

    // Fallback: show text input
    setShowInput(true);
    setMsg('📝 把你剛說的打出嚟 Type what you said');
    setEmotion(getRandomEmotion('during'));
  }, [aiAvailable]);

  // ---- Manual type + analyze (fallback) ----
  const analyze = () => {
    const input = text.trim() || transcript.trim();
    if (!input) return;
    runAnalysis(input);
  };

  // ---- Greeting based on scene ----
  const greeting = `Hello! I'm your AI English tutor. Let's practice ${scene.nameEn.toLowerCase()} together. How can I help you today?`;
  const followUp1 = `Great! What would you like to focus on today?`;
  const followUp2 = `Excellent choice. Let's start with a natural conversation!`;

  return (
    <KeyboardAvoidingView style={st.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={st.head}>
        <Text style={[st.title, FX]}>English Coach</Text>
        {!aiAvailable && (
          <Text style={[st.offlineBadge, F]}>offline</Text>
        )}
      </View>

      {/* Scene pill */}
      <View style={st.sceneWrap}>
        <TouchableOpacity style={st.scenePill} onPress={() => setPicker(!picker)} activeOpacity={0.85}>
          <Text style={[st.sceneT, FB]}>{scene.nameEn}</Text>
          <Text style={st.arr}>{picker ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {picker && (
          <View style={st.drop}>
            {SCENES.map(s => (
              <TouchableOpacity
                key={s.id}
                style={[st.dItem, state.scene === s.id && st.dItemOn]}
                onPress={() => pick(s.id)}
              >
                <Text style={[st.dText, FB, state.scene === s.id && st.dTextOn]}>{s.icon}  {s.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <ScrollView ref={scroll} style={st.body} contentContainerStyle={st.bodyC} keyboardShouldPersistTaps="handled">
        {/* AI greeting */}
        <Bubble role="ai" text={greeting} onLongPress={text => setWordContext(text)} />

        {/* Dynamic chat history */}
        {chatHistory.map((msg, i) => (
          <Bubble key={i} role={msg.role} text={msg.text} onLongPress={text => setWordContext(text)} />
        ))}

        {/* AI response + corrections after analysis */}
        {aiResponse && aiResponse.corrections?.length > 0 && (
          <View style={st.row}>
            <View style={st.avCo}><Text style={st.avEmoji}>🤖</Text></View>
            <View style={st.bubbleAI}>
              <Text style={[st.bubbleLabel, FB]}>💡 改進建議 Corrections</Text>
              {aiResponse.corrections.map((c, i) => (
                <View key={i} style={{ marginBottom: i < aiResponse.corrections.length - 1 ? 8 : 0 }}>
                  <Text style={[st.correctOrig, F]}>「{c.original}」</Text>
                  <Text style={[st.correctSug, FB]}>→ {c.suggestion}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Follow-up prompt from AI */}
        {aiResponse?.followUpPrompt && (
          <View style={st.row}>
            <View style={st.avCo}><Text style={st.avEmoji}>🤖</Text></View>
            <View style={st.bubbleAI}>
              <Text style={[st.bubbleLabel, FB]}>📋 下一個練習 Next</Text>
              <Pressable onLongPress={() => setWordContext(aiResponse.followUpPrompt)} delayLongPress={400}>
                <Text style={[st.promptEn, FX]}>{aiResponse.followUpPrompt}</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* No chat yet — show example prompts */}
        {chatHistory.length === 0 && !loading && (
          <>
            <Bubble role="user" text="I have a meeting with a client this afternoon." onLongPress={text => setWordContext(text)} />
            <Bubble role="ai" text={followUp1} onLongPress={text => setWordContext(text)} />
            <Bubble role="user" text="I want to practice greeting and introducing our service." onLongPress={text => setWordContext(text)} />
            <Bubble role="ai" text={followUp2} onLongPress={text => setWordContext(text)} />

            {/* Practice prompt */}
            <View style={st.row}>
              <View style={st.avCo}><Text style={st.avEmoji}>🤖</Text></View>
              <View style={st.bubbleAI}>
                <Text style={[st.bubbleLabel, FB]}>📋 練習題 Practice</Text>
                <Pressable onLongPress={() => setWordContext(prompt.en)} delayLongPress={400}>
                  <Text style={[st.promptEn, FX]}>{prompt.en}</Text>
                </Pressable>
                <Text style={[st.promptZh, F]}>{prompt.zh}</Text>
                <TouchableOpacity style={st.refreshBtn} onPress={reset}>
                  <Text style={[st.refreshT, FB]}>🔄 換題</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Useful phrases */}
            <View style={st.row}>
              <View style={st.avCo}><Text style={st.avEmoji}>🤖</Text></View>
              <View style={st.bubbleAI}>
                <Text style={[st.bubbleLabel, FB]}>📖 實用句型</Text>
                {scene.usefulPhrases.slice(0, 3).map((p, i) => (
                  <TouchableOpacity
                    key={i}
                    style={st.phRow}
                    onPress={() => { setText(prev => prev + (prev ? ' ' : '') + p.en); if (!showInput) setShowInput(true); }}
                    onLongPress={() => setWordContext(p.en)}
                    delayLongPress={400}
                  >
                    <Text style={[st.phEn, FB]}>{p.en}</Text>
                    <Text style={[st.phZh, F]}>{p.zh}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        {/* Status message */}
        {msg ? (
          <View style={st.statusCard}>
            <Text style={[st.statusT, FB]}>{msg}</Text>
            {loading && <ActivityIndicator color={PINK} style={{ marginTop: 8 }} />}
          </View>
        ) : null}

        {/* Recording indicator */}
        {recording && (
          <View style={st.speakCard}>
            <Animated.View style={{ transform: [{ scale: pulse }] }}>
              <Text style={st.micBig}>🎤</Text>
            </Animated.View>
            <Text style={[st.speakT, FB]}>Listening...</Text>
            <Text style={[st.speakSub, F]}>放開按鈕後自動辨識 Release to transcribe</Text>
          </View>
        )}

        {/* Input area (fallback) */}
        {showInput && !recording && !loading && (
          <View style={st.inputCard}>
            <Text style={[st.bubbleLabel, FB]}>📝 輸入你講嘅內容 Type what you said</Text>
            <TextInput
              style={[st.input, F]}
              value={text}
              onChangeText={setText}
              placeholder="Type what you just said..."
              placeholderTextColor={MUTED}
              multiline
              autoFocus
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[st.analyzeBtn, !text.trim() && st.analyzeOff]}
              onPress={analyze}
              disabled={!text.trim()}
            >
              <Text style={[st.analyzeT, FB]}>🔍 分析 Analyze</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* User transcript card */}
        {transcript && !showInput && !chatHistory.some(c => c.role === 'user' && c.text === transcript) ? (
          <View style={[st.row, st.rowRight]}>
            <View style={st.bubbleUser}>
              <Pressable onLongPress={() => setWordContext(transcript)} delayLongPress={400}>
                <Text style={[st.bubbleT, FB, st.bubbleTUser]}>{transcript}</Text>
              </Pressable>
            </View>
            <View style={st.avCoUser}><Text style={st.avEmoji}>😊</Text></View>
          </View>
        ) : null}

        {/* Analysis */}
        {analysis && (
          <View style={st.row}>
            <View style={st.avCo}><Text style={st.avEmoji}>🤖</Text></View>
            <View style={st.bubbleAI}>
              <Text style={[st.bubbleLabel, FB]}>📊 分析結果 Analysis</Text>
              <View style={st.overallRow}>
                <Text style={[st.bigScore, FX]}>{analysis.overall.score}</Text>
                <View>
                  <Text style={[st.lvlBadge, FB]}>CEFR {analysis.overall.level}</Text>
                  <Text style={[st.sub, F]}>總分 Overall</Text>
                </View>
              </View>
              {(['fluency', 'vocabulary', 'pronunciation', 'grammar'] as const).map(c => {
                const d = analysis[c];
                const ico = { fluency: '💨', vocabulary: '📚', pronunciation: '🔊', grammar: '📐' };
                return (
                  <View key={c} style={st.met}>
                    <Text style={st.metI}>{ico[c]}</Text>
                    <View style={st.metB}>
                      <View style={[st.metF, { width: `${d.score}%` }]} />
                    </View>
                    <Text style={[st.metV, FB]}>{d.score}</Text>
                  </View>
                );
              })}
              <Text style={[st.aiFeedback, F]}>
                {aiAvailable ? '✨ AI-powered analysis' : '⚠️ Offline mode — set API keys for real AI'}
              </Text>
            </View>
          </View>
        )}

        {/* Emotion / encouragement */}
        {emotion && (
          <View style={st.emoRow}>
            <Text style={st.emoI}>💖</Text>
            <View style={{ flex: 1 }}>
              <Text style={[st.emoEn, FB]}>{emotion.en}</Text>
              <Text style={[st.emoZh, F]}>{emotion.zh}</Text>
            </View>
          </View>
        )}

        <View style={{ height: 200 }} />
      </ScrollView>

      {/* Bottom mic */}
      {!showInput && !loading && (
        <View style={st.bottom}>
          <View style={st.diffRow}>
            {DIFFS.map(d => (
              <TouchableOpacity
                key={d}
                style={[st.dBtn, state.difficulty === d && st.dBtnOn]}
                onPress={() => diff(d)}
              >
                <Text style={[st.dT, FB, state.difficulty === d && st.dTOn]}>{DIFF_L[d]}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Pressable
            style={[st.recOut, recording && st.recOutOn]}
            onPressIn={startRecording}
            onPressOut={stopRecording}
          >
            <Animated.View style={[st.recIn, { transform: [{ scale: pulse }] }]}>
              <Text style={st.recIcon}>{recording ? '🔴' : '🎤'}</Text>
            </Animated.View>
          </Pressable>
          <Text style={[st.recHint, F]}>按住說話 · Hold to speak</Text>
        </View>
      )}

      {/* Manual type button when input is showing */}
      {showInput && !recording && !loading && (
        <View style={st.bottom}>
          <TouchableOpacity style={st.backBtn} onPress={() => { setShowInput(false); setText(''); setTranscript(''); }}>
            <Text style={[st.backBtnT, FB]}>← 返回錄音 Back to Recording</Text>
          </TouchableOpacity>
        </View>
      )}

      <WordPickerModal
        visible={wordContext !== null}
        context={wordContext || undefined}
        onClose={() => setWordContext(null)}
      />
    </KeyboardAvoidingView>
  );
}

// ---- Chat bubble component ----
function Bubble({ role, text, onLongPress }: { role: 'ai' | 'user'; text: string; onLongPress: (t: string) => void }) {
  if (role === 'ai') {
    return (
      <View style={st.row}>
        <View style={st.avCo}><Text style={st.avEmoji}>🤖</Text></View>
        <View style={st.bubbleAI}>
          <Pressable onLongPress={() => onLongPress(text)} delayLongPress={400}>
            <Text style={[st.bubbleT, FB]}>{text}</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  return (
    <View style={[st.row, st.rowRight]}>
      <View style={st.bubbleUser}>
        <Pressable onLongPress={() => onLongPress(text)} delayLongPress={400}>
          <Text style={[st.bubbleT, FB, st.bubbleTUser]}>{text}</Text>
        </Pressable>
      </View>
      <View style={st.avCoUser}><Text style={st.avEmoji}>😊</Text></View>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  head: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 32, color: PINK, letterSpacing: 0.5 },
  offlineBadge: { fontSize: 11, color: MUTED, backgroundColor: '#fff3e0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, overflow: 'hidden' },
  sceneWrap: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 8, zIndex: 10 },
  scenePill: {
    backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  sceneT: { fontSize: 14, color: INK },
  arr: { fontSize: 10, color: MUTED },
  drop: {
    backgroundColor: '#fff', borderRadius: 18, padding: 8, marginTop: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 6,
  },
  dItem: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
  dItemOn: { backgroundColor: PINK_SOFT },
  dText: { fontSize: 14, color: INK },
  dTextOn: { color: PINK },
  body: { flex: 1 },
  bodyC: { padding: 20, gap: 14 },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  rowRight: { justifyContent: 'flex-end' },
  avCo: { width: 40, height: 40, borderRadius: 20, backgroundColor: PINK_SOFT, alignItems: 'center', justifyContent: 'center' },
  avCoUser: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1.5, borderColor: PINK_SOFT, alignItems: 'center', justifyContent: 'center' },
  avEmoji: { fontSize: 20 },
  bubbleAI: {
    flex: 1, backgroundColor: '#fff', borderRadius: 22, borderBottomLeftRadius: 6, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  bubbleUser: {
    backgroundColor: PINK, borderRadius: 22, borderBottomRightRadius: 6, paddingVertical: 14, paddingHorizontal: 18, maxWidth: '78%',
    shadowColor: PINK, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  bubbleT: { fontSize: 14, color: INK, lineHeight: 22 },
  bubbleTUser: { color: '#fff' },
  bubbleLabel: { fontSize: 11, color: PINK, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  promptEn: { fontSize: 16, color: INK, lineHeight: 24, marginBottom: 4 },
  promptZh: { fontSize: 12, color: SUBINK, lineHeight: 18 },
  refreshBtn: { alignSelf: 'flex-start', marginTop: 8, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: PINK_SOFT, borderRadius: 8 },
  refreshT: { fontSize: 11, color: PINK },
  phRow: { paddingVertical: 8, borderTopWidth: 1, borderColor: '#faf0eb' },
  phEn: { fontSize: 14, color: INK },
  phZh: { fontSize: 11, color: MUTED, marginTop: 2 },
  statusCard: { backgroundColor: PINK_SOFT, borderRadius: 16, padding: 12, alignItems: 'center', marginLeft: 50 },
  statusT: { fontSize: 14, color: PINK },
  speakCard: { backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 2, borderColor: PINK, marginLeft: 50 },
  micBig: { fontSize: 56 },
  speakT: { fontSize: 18, color: PINK, marginTop: 8 },
  speakSub: { fontSize: 12, color: MUTED, marginTop: 4 },
  inputCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 16, marginLeft: 50,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  input: {
    backgroundColor: CREAM, borderRadius: 14, padding: 14, minHeight: 80, fontSize: 15, color: INK, lineHeight: 22,
    borderWidth: 1, borderColor: '#f5e8de',
  },
  analyzeBtn: {
    backgroundColor: PINK, paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 12,
    shadowColor: PINK, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 3,
  },
  analyzeOff: { opacity: 0.4 },
  analyzeT: { color: '#fff', fontSize: 15 },
  overallRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14, paddingBottom: 14, borderBottomWidth: 1, borderColor: '#faf0eb' },
  bigScore: { fontSize: 48, color: PINK },
  lvlBadge: { fontSize: 13, color: '#4caf50', backgroundColor: '#e8f5e9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  sub: { fontSize: 11, color: MUTED, marginTop: 4 },
  met: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  metI: { fontSize: 16, width: 24 },
  metB: { flex: 1, height: 8, backgroundColor: PINK_SOFT, borderRadius: 4, overflow: 'hidden' },
  metF: { height: '100%', backgroundColor: PINK, borderRadius: 4 },
  metV: { fontSize: 14, color: INK, width: 32, textAlign: 'right' },
  aiFeedback: { fontSize: 10, color: MUTED, textAlign: 'center', marginTop: 10, fontStyle: 'italic' },
  emoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff0f0', borderRadius: 18, padding: 14, marginLeft: 50 },
  emoI: { fontSize: 26 },
  emoEn: { fontSize: 13, color: '#d4446a' },
  emoZh: { fontSize: 11, color: '#c07a8a', marginTop: 2 },
  correctOrig: { fontSize: 13, color: '#d4446a', marginBottom: 2 },
  correctSug: { fontSize: 13, color: '#4caf50' },
  bottom: {
    backgroundColor: '#fff', paddingTop: 12, paddingBottom: 30, alignItems: 'center',
    borderTopWidth: 1, borderColor: '#f0e0d0',
    shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 12,
  },
  backBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14, backgroundColor: PINK_SOFT },
  backBtnT: { fontSize: 14, color: PINK },
  diffRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  dBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12, backgroundColor: CREAM, borderWidth: 1, borderColor: '#f5e8de' },
  dBtnOn: { backgroundColor: PINK, borderColor: PINK },
  dT: { fontSize: 12, color: SUBINK },
  dTOn: { color: '#fff' },
  recOut: {
    width: 78, height: 78, borderRadius: 39, backgroundColor: PINK, alignItems: 'center', justifyContent: 'center',
    shadowColor: PINK, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 10,
  },
  recOutOn: { backgroundColor: '#ff5e5e' },
  recIn: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  recIcon: { fontSize: 28 },
  recHint: { fontSize: 12, color: MUTED, marginTop: 8 },
});
