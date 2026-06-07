import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { TextInput, TextInputProps, View, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { radius, spacing } from '@/theme/spacing';
import { ThemedText } from './ThemedText';

interface Props extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function FormField({ label, error, icon, ...rest }: Props) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ gap: 4 }}>
      <ThemedText variant="label" color="textMuted">{label}</ThemedText>
      <View
        style={[
          styles.inputWrap,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.danger : focused ? colors.primary : colors.border,
          },
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={16}
            color={focused ? colors.primary : colors.textMuted}
            style={{ marginRight: spacing.sm }}
          />
        ) : null}
        <TextInput
          {...rest}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          placeholderTextColor={colors.textDim}
          style={[styles.input, { color: colors.text }]}
        />
      </View>
      {error && (
        <ThemedText variant="caption" color="danger">{error}</ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
});