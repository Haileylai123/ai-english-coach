// services/theme.ts — Unified design system
import { StyleSheet, Dimensions } from 'react-native';
export const W = Dimensions.get('window').width;

// ---- Colors ----
export const C = {
  pink:      '#e8927f',
  pinkSoft:  '#fbe4dc',
  cream:     '#fdf2ec',
  ink:       '#3d3028',
  sub:       '#7a6a5e',
  muted:     '#b8a89a',
  green:     '#7ec48b',
  red:       '#e57373',
  gold:      '#f0c44e',
  white:     '#ffffff',
} as const;

// ---- Typography ----
export const T = {
  h1:  { fontFamily: 'Nunito_800ExtraBold', fontSize: 28, color: C.pink },
  h2:  { fontFamily: 'Nunito_700Bold',       fontSize: 18, color: C.ink },
  h3:  { fontFamily: 'Nunito_700Bold',       fontSize: 15, color: C.ink },
  body:{ fontFamily: 'Nunito_400Regular',    fontSize: 14, color: C.ink, lineHeight: 22 },
  sub: { fontFamily: 'Nunito_400Regular',    fontSize: 12, color: C.sub, lineHeight: 18 },
  mute:{ fontFamily: 'Nunito_400Regular',    fontSize: 11, color: C.muted },
  score:{ fontFamily: 'Nunito_800ExtraBold', fontSize: 48, color: C.pink },
  btn: { fontFamily: 'Nunito_700Bold',       fontSize: 15, color: C.white },
  pill:{ fontFamily: 'Nunito_700Bold',       fontSize: 11, color: C.pink },
} as const;

// ---- Layout ----
export const L = {
  pad:   16,
  gap:   12,
  rad:   16,
  radSm: 12,
  radLg: 20,
} as const;

// ---- Shared card style ----
export const card = {
  backgroundColor: C.white,
  borderRadius: L.rad,
  padding: L.pad,
  marginBottom: L.gap,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.04,
  shadowRadius: 4,
  elevation: 1,
} as const;

// ---- Shared button styles ----
export const btn = {
  primary: {
    backgroundColor: C.pink,
    paddingVertical: 14,
    borderRadius: L.rad,
    alignItems: 'center' as const,
  },
  ghost: {
    backgroundColor: C.pinkSoft,
    paddingVertical: 12,
    borderRadius: L.radSm,
    alignItems: 'center' as const,
  },
  outline: {
    backgroundColor: C.white,
    paddingVertical: 12,
    borderRadius: L.radSm,
    borderWidth: 1.5,
    borderColor: C.pink,
    alignItems: 'center' as const,
  },
};

// ---- Screen wrapper ----
export const screen = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.cream },
  content: { paddingTop: 60, paddingHorizontal: L.pad, paddingBottom: 40 },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingHorizontal: L.pad, paddingTop: 60 },
  title: { ...T.h1 },
}).root;
