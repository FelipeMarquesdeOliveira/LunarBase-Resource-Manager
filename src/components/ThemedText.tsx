import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { typography } from '@/theme/spacing';

type Variant = keyof typeof typography;

interface ThemedTextProps extends TextProps {
  variant?: Variant;
  color?: 'text' | 'textMuted' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  align?: TextStyle['textAlign'];
}

export function ThemedText({ variant = 'body', color = 'text', align, style, ...rest }: ThemedTextProps) {
  const { colors } = useTheme();
  const palette: Record<NonNullable<ThemedTextProps['color']>, string> = {
    text: colors.text,
    textMuted: colors.textMuted,
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
  };
  return (
    <Text
      {...rest}
      style={[
        styles.base,
        typography[variant],
        { color: palette[color] },
        align ? { textAlign: align } : null,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    color: '#fff',
  },
});
