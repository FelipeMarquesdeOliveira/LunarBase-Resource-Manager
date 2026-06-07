import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { spacing } from '@/theme/spacing';
import { ThemedText } from './ThemedText';

interface Props {
  title: string;
  value: string;
  caption?: string;
  icon: keyof typeof Ionicons.glyphMap;
  tone?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}

export function StatCard({ title, value, caption, icon, tone = 'primary' }: Props) {
  const { colors } = useTheme();
  const color = colors[tone];
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${color}22` }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View style={styles.text}>
        <ThemedText variant="caption" color="textMuted">{title}</ThemedText>
        <ThemedText variant="h2">{value}</ThemedText>
        {caption ? <ThemedText variant="caption" color="textMuted">{caption}</ThemedText> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.md,
    minWidth: 0,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 2 },
});
