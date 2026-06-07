import { View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { spacing } from '@/theme/spacing';
import { ThemedText } from './ThemedText';

interface Props {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  dense?: boolean;
}

export function SectionHeader({ title, subtitle, right, dense = false }: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
        marginBottom: dense ? spacing.sm : spacing.md,
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View style={{ gap: 2 }}>
        <ThemedText variant="label" color="textMuted">{title}</ThemedText>
        {subtitle && <ThemedText variant="caption" color="textMuted">{subtitle}</ThemedText>}
      </View>
      {right}
    </View>
  );
}