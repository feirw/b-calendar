import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/components/useThemeColors';
import { useI18n } from '@/i18n';

export default function NotFoundScreen() {
  const { t } = useI18n();
  const colors = useThemeColors();

  return (
    <>
      <Stack.Screen options={{ title: t('notFound.title') }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>{t('notFound.title')}</Text>
        <Link href="/" style={styles.link}>
          <Text style={[styles.linkText, { color: colors.tint }]}>{t('notFound.back')}</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  link: {
    marginTop: 16,
    minHeight: 44,
    justifyContent: 'center',
  },
  linkText: {
    fontSize: 17,
  },
});
