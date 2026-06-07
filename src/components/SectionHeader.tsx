import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme/spacing';
import { ThemedText } from './ThemedText';

interface Props {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, right }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.text}>
        <ThemedText variant="h2">{title}</ThemedText>
        {subtitle ? <ThemedText variant="caption" color="textMuted">{subtitle}</ThemedText> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  text: { gap: 2, flex: 1 },
});
