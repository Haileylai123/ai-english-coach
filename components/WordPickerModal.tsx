import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useStore } from '../services/store';

const PINK = '#e8927f';
const PINK_SOFT = '#fbe4dc';
const CREAM = '#fdf2ec';
const INK = '#3d3028';
const SUBINK = '#7a6a5e';
const MUTED = '#b8a89a';

interface Props {
  visible: boolean;
  context?: string;
  prefillWord?: string;
  onClose: () => void;
}

export default function WordPickerModal({ visible, context, prefillWord, onClose }: Props) {
  const { state, dispatch } = useStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [zh, setZh] = useState('');
  const [mode, setMode] = useState<'pick' | 'input'>('pick');

  // Extract words from context
  const words = useMemo(() => {
    if (!context) return [];
    const seen = new Set<string>();
    return context
      .replace(/[^\w\s']/g, ' ')
      .split(/\s+/)
      .filter(w => {
        const lower = w.toLowerCase();
        if (lower.length < 2) return false;
        if (seen.has(lower)) return false;
        seen.add(lower);
        return true;
      })
      .slice(0, 30);
  }, [context]);

  const handleSave = (word: string) => {
    if (state.customVocab.some(v => v.en.toLowerCase() === word.toLowerCase())) {
      Alert.alert('已經加咗', `「${word}」已經喺你嘅單詞庫入面`);
      return;
    }
    dispatch({
      type: 'ADD_CUSTOM_VOCAB',
      payload: {
        en: word,
        zh: zh.trim(),
        context,
        source: 'chat',
      },
    });
    Alert.alert('已加入！⭐', `「${word}」已加入單詞庫`);
    setSelected(null);
    setZh('');
    onClose();
  };

  const handleSaveManual = () => {
    const en = prefillWord?.trim() || '';
    if (!en) {
      Alert.alert('提示', '請輸入英文生字');
      return;
    }
    if (state.customVocab.some(v => v.en.toLowerCase() === en.toLowerCase())) {
      Alert.alert('已經加咗', `「${en}」已經喺你嘅單詞庫入面`);
      return;
    }
    dispatch({
      type: 'ADD_CUSTOM_VOCAB',
      payload: { en, zh: zh.trim(), source: 'manual' },
    });
    Alert.alert('已加入！⭐', `「${en}」已加入單詞庫`);
    setZh('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={st.backdrop} onPress={onClose}>
        <Pressable style={st.card} onPress={(e) => e.stopPropagation()}>
          <Text style={st.title}>加入單詞庫 ⭐</Text>

          {mode === 'pick' ? (
            <>
              {context && (
                <Text style={st.contextTxt} numberOfLines={3}>"{context}"</Text>
              )}
              <Text style={st.lab}>揀一個生字加入：</Text>
              <View style={st.wordsWrap}>
                <ScrollView style={{ maxHeight: 220 }} showsVerticalScrollIndicator={false}>
                  <View style={st.chipsRow}>
                    {words.map((w, i) => {
                      const isSelected = selected === w;
                      const inVocab = state.customVocab.some(v => v.en.toLowerCase() === w.toLowerCase());
                      return (
                        <TouchableOpacity
                          key={i}
                          style={[
                            st.chip,
                            isSelected && st.chipOn,
                            inVocab && st.chipDone,
                          ]}
                          onPress={() => !inVocab && setSelected(w)}
                          activeOpacity={0.85}
                          disabled={inVocab}
                        >
                          <Text style={[st.chipTxt, isSelected && st.chipTxtOn, inVocab && st.chipTxtDone]}>
                            {inVocab ? `${w} ✓` : w}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
              <View style={st.zhRow}>
                <Text style={st.lab}>中文意思（可選）：</Text>
                <TextInput
                  style={st.input}
                  placeholder="例如：機會"
                  placeholderTextColor={MUTED}
                  value={zh}
                  onChangeText={setZh}
                />
              </View>
              <View style={st.btnRow}>
                <TouchableOpacity style={st.btnGhost} onPress={onClose} activeOpacity={0.85}>
                  <Text style={st.btnGhostTxt}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[st.btn, !selected && st.btnOff]}
                  onPress={() => selected && handleSave(selected)}
                  activeOpacity={0.85}
                  disabled={!selected}
                >
                  <Text style={st.btnTxt}>加入 ⭐</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={st.lab}>輸入英文生字：</Text>
              <TextInput
                style={st.input}
                placeholder="例如：opportunity"
                placeholderTextColor={MUTED}
                value={prefillWord}
                editable={!prefillWord}
                autoFocus={!prefillWord}
              />
              <Text style={st.lab}>中文意思（可選）：</Text>
              <TextInput
                style={st.input}
                placeholder="例如：機會"
                placeholderTextColor={MUTED}
                value={zh}
                onChangeText={setZh}
              />
              <View style={st.btnRow}>
                <TouchableOpacity style={st.btnGhost} onPress={onClose} activeOpacity={0.85}>
                  <Text style={st.btnGhostTxt}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={st.btn}
                  onPress={handleSaveManual}
                  activeOpacity={0.85}
                >
                  <Text style={st.btnTxt}>加入 ⭐</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const st = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: PINK,
    marginBottom: 12,
    textAlign: 'center',
  },
  contextTxt: {
    fontSize: 12,
    color: SUBINK,
    fontStyle: 'italic',
    backgroundColor: CREAM,
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
    lineHeight: 18,
  },
  lab: {
    fontSize: 12,
    color: SUBINK,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 4,
  },
  wordsWrap: { marginBottom: 10 },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: CREAM,
    borderWidth: 1,
    borderColor: '#f0e0d0',
  },
  chipOn: { backgroundColor: PINK, borderColor: PINK },
  chipDone: { backgroundColor: '#e8f5e9', borderColor: '#c8e6c9', opacity: 0.6 },
  chipTxt: { fontSize: 13, color: INK, fontWeight: '600' },
  chipTxtOn: { color: '#fff' },
  chipTxtDone: { color: '#7ec48b', textDecorationLine: 'line-through' },
  zhRow: { marginTop: 6 },
  input: {
    backgroundColor: CREAM,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: INK,
    borderWidth: 1,
    borderColor: '#f0e0d0',
    marginBottom: 4,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  btnGhost: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: CREAM,
    alignItems: 'center',
  },
  btnGhostTxt: { color: SUBINK, fontWeight: '700', fontSize: 14 },
  btn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: PINK,
    alignItems: 'center',
  },
  btnOff: { backgroundColor: MUTED, opacity: 0.5 },
  btnTxt: { color: '#fff', fontWeight: '800', fontSize: 14 },
});
