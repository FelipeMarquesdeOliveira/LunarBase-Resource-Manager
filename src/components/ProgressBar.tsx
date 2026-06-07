import { View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { ThemedText } from './ThemedText';

interface Props {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
}

export function ProgressBar({ value, max = 100, color, height = 4, showLabel = false }: Props) {
  const { colors } = useTheme();
  const ratio = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  const barColor = color ?? colors.primary;

  return (
    <View style={{ width: '100%' }}>
      {showLabel && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
          <View />
          <ThemedText variant="mono" style={{ color: colors.textMuted }}>
            {Math.round(ratio * 100)}%
          </ThemedText>
        </View>
      )}
      <View
        style={{
          height,
          backgroundColor: colors.surfaceAlt,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${ratio * 100}%`,
            height: '100%',
            borderRadius: 2,
            backgroundColor: barColor,
          }}
        />
      </View>
    </View>
  );
}