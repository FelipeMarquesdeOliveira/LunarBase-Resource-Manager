import { Text, type TextProps, type TextStyle, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { typography } from '@/theme/spacing';

type Variant = keyof typeof typography;

interface ThemedTextProps extends TextProps {
  variant?: Variant;
  color?: 'text' | 'textMuted' | 'textDim' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  align?: TextStyle['textAlign'];
  uppercase?: boolean;
}

export function ThemedText({
  variant = 'body',
  color = 'text',
  align,
  uppercase,
  style,
  ...rest
}: ThemedTextProps) {
  const { colors } = useTheme();
  const palette: Record<NonNullable<ThemedTextProps['color']>, string> = {
    text: colors.text,
    textMuted: colors.textMuted,
    textDim: colors.textDim,
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
  };

  const textStyle = typography[variant];

  return (
    <Text
      {...rest}
      style={[
        textStyle,
        { color: palette[color] },
        align ? { textAlign: align } : null,
        uppercase ? styles.uppercase : null,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  uppercase: { textTransform: 'uppercase' },
});