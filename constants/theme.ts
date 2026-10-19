import { DarkTheme, DefaultTheme } from 'expo-router';

export const colors = {
  light: {
    text: '#1C1C1E',
    secondary: '#8E8E93',
    quaternary: '#C7C7CC',
    background: '#FFFFFF',
    grouped: '#F2F2F7',
    card: '#FFFFFF',
    today: '#FF3B30',
    todayFill: 'rgba(255, 59, 48, 0.08)',
    selectedDay: '#E5E5EA',
    separator: 'rgba(60, 60, 67, 0.29)',
    tint: '#FF3B30',
    border: '#E5E5EA',
  },
  dark: {
    text: '#F5F5F7',
    secondary: '#8E8E93',
    quaternary: '#48484A',
    background: '#000000',
    grouped: '#000000',
    card: '#1C1C1E',
    today: '#FF453A',
    todayFill: 'rgba(255, 69, 58, 0.18)',
    selectedDay: '#2C2C2E',
    separator: 'rgba(84, 84, 88, 0.65)',
    tint: '#FF453A',
    border: '#2C2C2E',
  },
} as const;

export type AppColorScheme = keyof typeof colors;

export function navigationTheme(scheme: AppColorScheme) {
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const palette = colors[scheme];

  return {
    ...base,
    colors: {
      ...base.colors,
      primary: palette.today,
      background: palette.background,
      card: palette.card,
      text: palette.text,
      border: palette.separator,
      notification: palette.today,
    },
  };
}
