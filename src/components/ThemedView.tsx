import { View, type ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { radius, spacing } from '@/theme/spacing';

type Variant = 'background' | 'surface' | 'surfaceAlt' | 'surfaceHigh';
type Padding = keyof typeof spacing;

interface ThemedViewProps extends ViewProps {
  variant?: Variant;
  padded?: Padding | boolean;
  rounded?: keyof typeof radius;
  bordered?: boolean;
  gap?: Padding;
  row?: boolean;
  align?: 'start' | 'center' | 'end';
}

export function ThemedView({
  variant = 'background',
  padded,
  rounded = 'md',
  bordered,
  gap,
  row,
  align,
  style,
  children,
  ...rest
}: ThemedViewProps) {
  const { colors } = useTheme();
  const palette = {
    background: colors.background,
    surface: colors.surface,
    surfaceAlt: colors.surfaceAlt,
    surfaceHigh: colors.surfaceHigh,
  };

  const padding =
    typeof padded === 'boolean' ? (padded ? spacing.lg : 0) : padded ? spacing[padded] : undefined;

  return (
    <View
      {...rest}
      style={[
        { backgroundColor: palette[variant], borderRadius: radius[rounded] },
        bordered ? { borderWidth: 1, borderColor: colors.border } : null,
        padding !== undefined ? { padding } : null,
        row ? styles.row : null,
        align === 'center' ? { alignItems: 'center' } : align === 'end' ? { alignItems: 'flex-end' } : null,
        gap ? { gap: spacing[gap] } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});