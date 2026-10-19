import { useColorScheme } from 'react-native';

import { colors, type AppColorScheme } from '@/constants/theme';

export function useColorSchemeName(): AppColorScheme {
  return useColorScheme() === 'dark' ? 'dark' : 'light';
}

export function useThemeColors() {
  return colors[useColorSchemeName()];
}
