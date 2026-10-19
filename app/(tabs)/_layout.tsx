import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import type { SFSymbol } from 'sf-symbols-typescript';

import { HeaderAddButton } from '@/components/HeaderAddButton';
import { useThemeColors } from '@/components/useThemeColors';
import { useI18n } from '@/i18n';

function TabIcon({ name, color }: { name: SFSymbol; color: ColorValue }) {
  return <SymbolView name={name} tintColor={color} size={24} />;
}

function largeTitle(color: string) {
  return {
    headerLargeTitle: true,
    headerLargeTitleShadowVisible: false,
    headerLargeTitleStyle: { color, fontWeight: '700' as const },
  };
}

export default function TabLayout() {
  const { t } = useI18n();
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text, fontWeight: '600' },
        tabBarActiveTintColor: colors.today,
        tabBarInactiveTintColor: colors.secondary,
        sceneStyle: { backgroundColor: colors.background },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.upcoming'),
          ...largeTitle(colors.text),
          headerRight: () => <HeaderAddButton />,
          tabBarIcon: ({ color }) => <TabIcon name="list.bullet" color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: t('tabs.calendar'),
          tabBarLabel: t('tabs.calendar'),
          headerRight: () => <HeaderAddButton />,
          tabBarIcon: ({ color }) => <TabIcon name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          ...largeTitle(colors.text),
          tabBarIcon: ({ color }) => <TabIcon name="gearshape" color={color} />,
        }}
      />
    </Tabs>
  );
}
