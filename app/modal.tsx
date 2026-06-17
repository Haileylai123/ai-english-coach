import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const PINK = '#e8927f';
const PINK_SOFT = '#fbe4dc';
const CREAM = '#fdf2ec';
const INK = '#3d3028';
const SUBINK = '#7a6a5e';
const MUTED = '#b8a89a';

const F = { fontFamily: 'Nunito_400Regular' };
const FB = { fontFamily: 'Nunito_700Bold' };
const FX = { fontFamily: 'Nunito_800ExtraBold' };

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View style={st.root}>
      <View style={st.bar} />
      <ScrollView contentContainerStyle={st.body}>
        <Text style={[st.title, FX]}>English Coach</Text>
        <Text style={[st.sub, F]}>Learn English. Save cats. 🐱</Text>
        <View style={st.card}>
          <Text style={[st.cardTitle, FB]}>About</Text>
          <Text style={[st.cardText, F]}>
            English Coach is an AI-powered English speaking app for Asian learners.
            Each subscription helps feed rescue cats through our charity partners.
          </Text>
        </View>
        <TouchableOpacity style={st.btn} onPress={() => router.back()}>
          <Text style={[st.btnTxt, FB]}>Close</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  bar: { width: 42, height: 5, backgroundColor: MUTED, borderRadius: 3, alignSelf: 'center', marginTop: 12 },
  body: { padding: 24, paddingTop: 24, alignItems: 'center' },
  title: { fontSize: 28, color: PINK },
  sub: { fontSize: 14, color: SUBINK, marginTop: 4, marginBottom: 28 },
  card: {
    width: '100%', backgroundColor: '#fff', borderRadius: 18, padding: 20, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  cardTitle: { fontSize: 16, color: PINK, marginBottom: 8 },
  cardText: { fontSize: 14, color: INK, lineHeight: 22 },
  btn: {
    backgroundColor: PINK, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 16,
    shadowColor: PINK, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 3,
  },
  btnTxt: { color: '#fff', fontSize: 16 },
});
