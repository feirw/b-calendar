import { Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useColorSchemeName } from '@/components/useThemeColors';
import { navigationTheme } from '@/constants/theme';
import { I18nProvider } from '@/i18n';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  return (
    <I18nProvider>
      <RootNavigator />
    </I18nProvider>
  );
}

function RootNavigator() {
  const scheme = useColorSchemeName();

  return (
    <ThemeProvider value={navigationTheme(scheme)}>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="birthday/[id]"
          options={{
            presentation: 'formSheet',
            sheetGrabberVisible: true,
            sheetAllowedDetents: [1],
            headerShown: false,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
