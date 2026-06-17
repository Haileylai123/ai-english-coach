import { Text as DefaultText, View as DefaultView, useColorScheme as useColorSchemeCore } from 'react-native';

export function useColorScheme(): 'light' | 'dark' {
  const scheme = useColorSchemeCore();
  return scheme === 'dark' ? 'dark' : 'light';
}

// Minimal Colors — full theme support TBD
const Colors = {
  light: { text: '#000', background: '#fff', tint: '#e8927f' },
  dark:  { text: '#fff', background: '#111', tint: '#e8927f' },
};

type ThemeProps = { lightColor?: string; darkColor?: string };

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme] || props.light || props.dark;
  if (colorFromProps) return colorFromProps;
  return Colors[theme][colorName];
}

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text({ style, lightColor, darkColor, ...otherProps }: TextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View({ style, lightColor, darkColor, ...otherProps }: ViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
