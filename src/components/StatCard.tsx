import { View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { spacing } from '@/theme/spacing';
import { ThemedText } from './ThemedText';

interface Props {
  title: string;
  value: string;
  caption?: string;
  tone?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'text';
  compact?: boolean;
}

export function StatCard({ title, value, caption, tone = 'text', compact = false }: Props) {
  const { colors } = useTheme();
  const color = tone === 'text' ? colors.text : colors[tone];

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 5,
        padding: compact ? spacing.sm : spacing.md,
        flex: 1,
        minWidth: 0,
      }}
    >
      <ThemedText variant="label" color="textMuted">
        {title}
      </ThemedText>
      <ThemedText
        variant={compact ? 'h2' : 'dataLarge'}
        style={{ color, marginTop: 2, fontFamily: undefined }}
      >
        {value}
      </ThemedText>
      {caption && (
        <ThemedText variant="caption" color="textMuted" style={{ marginTop: 2 }}>
          {caption}
        </ThemedText>
      )}
    </View>
  );
}