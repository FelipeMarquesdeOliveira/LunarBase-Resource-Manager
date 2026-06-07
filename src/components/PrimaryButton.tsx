import { Pressable, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { spacing, radius } from '@/theme/spacing';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function PrimaryButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  icon,
  fullWidth,
}: Props) {
  const { colors } = useTheme();

  const palette = {
    primary: { bg: colors.primary, fg: '#000', border: colors.primary },
    secondary: { bg: 'transparent', fg: colors.text, border: colors.border },
    ghost: { bg: 'transparent', fg: colors.textMuted, border: 'transparent' },
    danger: { bg: colors.danger, fg: '#fff', border: colors.danger },
  }[variant];

  const heights = { sm: 32, md: 40, lg: 48 };
  const h = heights[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          backgroundColor: palette.bg,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: palette.border,
          borderRadius: radius.sm,
          paddingHorizontal: spacing.lg,
          height: h,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} size="small" />
      ) : (
        <>
          {icon}
          <Text
            style={{
              color: palette.fg,
              fontSize: size === 'sm' ? 12 : 14,
              fontWeight: '600',
              marginLeft: icon ? 6 : 0,
            }}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}