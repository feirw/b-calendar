import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useThemeColors } from '@/components/useThemeColors';
import { useI18n } from '@/i18n';

export function HeaderAddButton() {
  const colors = useThemeColors();
  const { t } = useI18n();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('a11y.add')}
      onPress={() => router.push({ pathname: '/birthday/[id]', params: { id: 'new' } })}
      testID="add-birthday"
      style={styles.button}>
      <Text style={[styles.plus, { color: colors.today }]}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    fontSize: 34,
    lineHeight: 34,
    fontWeight: '300',
  },
});
