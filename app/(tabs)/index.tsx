import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';

import { BirthdayRow } from '@/components/BirthdayRow';
import { EmptyState } from '@/components/EmptyState';
import { useThemeColors } from '@/components/useThemeColors';
import { formatMessage, useI18n } from '@/i18n';
import { startOfLocalDay } from '@/lib/birthdays';
import { formatMonthYear } from '@/lib/calendarText';
import { upcomingEntries, type UpcomingEntry } from '@/lib/upcoming';
import { useBirthdayStore, useBirthdaysHydrated } from '@/store/birthdays';

export default function UpcomingScreen() {
  const { locale, t } = useI18n();
  const colors = useThemeColors();
  const hydrated = useBirthdaysHydrated();
  const birthdays = useBirthdayStore((state) => state.birthdays);
  const [today, setToday] = useState(() => startOfLocalDay(new Date()));

  useFocusEffect(
    useCallback(() => {
      setToday(startOfLocalDay(new Date()));
    }, []),
  );

  const sections = useMemo(() => {
    const entries = upcomingEntries(birthdays, today);
    const grouped: { key: string; title: string; data: UpcomingEntry[] }[] = [];
    for (const entry of entries) {
      const key = `${entry.occurrence.getFullYear()}-${entry.occurrence.getMonth()}`;
      const current = grouped[grouped.length - 1];
      if (!current || current.key !== key) {
        grouped.push({ key, title: formatMonthYear(locale, entry.occurrence), data: [entry] });
      } else {
        current.data.push(entry);
      }
    }
    return grouped;
  }, [birthdays, locale, today]);

  if (!hydrated) {
    return <View style={[styles.fill, { backgroundColor: colors.background }]} />;
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.birthday.id}
      stickySectionHeadersEnabled
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={sections.length === 0 ? styles.emptyContainer : styles.listContent}
      style={{ backgroundColor: colors.background }}
      ListEmptyComponent={
        <EmptyState
          title={t('upcoming.emptyTitle')}
          message={t('upcoming.emptyMessage')}
          actionLabel={t('upcoming.add')}
          onAction={() => router.push({ pathname: '/birthday/[id]', params: { id: 'new' } })}
        />
      }
      renderSectionHeader={({ section }) => (
        <Text style={[styles.section, { color: colors.secondary, backgroundColor: colors.background }]}>
          {section.title}
        </Text>
      )}
      renderItem={({ item }) => <BirthdayRow entry={item} subtitle={subtitleFor(item, t)} />}
      ItemSeparatorComponent={() => (
        <View style={[styles.separator, { backgroundColor: colors.separator }]} />
      )}
    />
  );
}

function subtitleFor(entry: UpcomingEntry, t: ReturnType<typeof useI18n>['t']) {
  const when =
    entry.days === 0
      ? t('relative.today')
      : entry.days === 1
        ? t('relative.tomorrow')
        : formatMessage(t('relative.inDays'), { count: entry.days });
  if (entry.age == null) return when;
  return `${when} · ${formatMessage(t('age.turns'), { age: entry.age })}`;
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  section: {
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 6,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 72,
  },
});
