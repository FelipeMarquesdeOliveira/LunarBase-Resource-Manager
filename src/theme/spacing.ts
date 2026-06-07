import { Platform } from 'react-native';

export const font = {
  mono: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  sans: Platform.OS === 'ios' ? 'System' : 'Roboto',
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  none: 0,
  sm: 3,
  md: 5,
  lg: 8,
  xl: 12,
  pill: 999,
} as const;

export const typography = {
  h1: { fontSize: 24, fontWeight: '700' as const, fontFamily: undefined, letterSpacing: -0.5 },
  h2: { fontSize: 18, fontWeight: '600' as const, fontFamily: undefined, letterSpacing: -0.3 },
  h3: { fontSize: 14, fontWeight: '600' as const, fontFamily: undefined },
  label: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.5, textTransform: 'uppercase' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  data: { fontSize: 20, fontWeight: '700' as const, fontFamily: font.mono },
  dataLarge: { fontSize: 32, fontWeight: '700' as const, fontFamily: font.mono },
  mono: { fontSize: 12, fontWeight: '400' as const, fontFamily: font.mono },
} as const;