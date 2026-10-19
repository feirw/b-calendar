import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BirthdayRow } from '@/components/BirthdayRow';
import { MonthCalendar } from '@/components/MonthCalendar';
import { useThemeColors } from '@/components/useThemeColors';
import { formatMessage, useI18n } from '@/i18n';
import { celebrationKey, dateKey, daysUntil, startOfLocalDay, turningAge } from '@/lib/birthdays';
import { formatDayMonth, weekdayLong } from '@/lib/calendarText';
import type { UpcomingEntry } from '@/lib/upcoming';
import { useBirthdayStore, useBirthdaysHydrated } from '@/store/birthdays';

export default function CalendarScreen() {
  const { locale, t } = useI18n();
  const colors = useThemeColors();
  const hydrated = useBirthdaysHydrated();
  const birthdays = useBirthdayStore((state) => state.birthdays);
  const today = useMemo(() => startOfLocalDay(new Date()), []);
  const [selected, setSelected] = useState(today);
  const [visible, setVisible] = useState(today);

  const people = useMemo(() => {
    const selectedKey = dateKey(selected.getFullYear(), selected.getMonth() + 1, selected.getDate());
    return birthdays
      .filter(
        (birthday) => celebrationKey(birthday.month, birthday.day, selected.getFullYear()) === selectedKey,
      )
      .sort((a, b) => a.name.localeCompare(b.name, 'el'))
      .map((birthday): UpcomingEntry => {
        const age = turningAge(birthday.year, selected);
        return {
          birthday,
          occurrence: selected,
          days: daysUntil(selected, today),
          age,
        };
      });
  }, [birthdays, selected, today]);

  const isToday = daysUntil(selected, today) === 0;
  const headingColor = isToday ? colors.today : colors.text;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}>
      {hydrated ? (
        <MonthCalendar
          birthdays={birthdays}
          selected={selected}
          visible={visible}
          onSelect={setSelected}
          onVisibleMonthChange={setVisible}
        />
      ) : null}
      <View style={[styles.rule, { backgroundColor: colors.separator }]} />
      <View style={styles.heading}>
        <Text style={[styles.headingTitle, { color: headingColor }]}>
          {formatDayMonth(locale, selected)}
        </Text>
        <Text style={[styles.headingWeekday, { color: isToday ? colors.today : colors.secondary }]}>
          {weekdayLong(locale, selected)}
        </Text>
      </View>
      {hydrated && people.length === 0 ? (
        <Text style={[styles.empty, { color: colors.secondary }]}>{t('calendar.emptyDay')}</Text>
      ) : (
        people.map((entry) => (
          <BirthdayRow
            key={entry.birthday.id}
            entry={entry}
            showDate={false}
            subtitle={agendaSubtitle(entry, t)}
          />
        ))
      )}
    </ScrollView>
  );
}

function agendaSubtitle(entry: UpcomingEntry, t: ReturnType<typeof useI18n>['t']) {
  const parts: string[] = [];
  if (entry.days === 0) parts.push(t('relative.today'));
  if (entry.age != null) parts.push(formatMessage(t('age.turns'), { age: entry.age }));
  if (parts.length === 0 && entry.birthday.note) return entry.birthday.note;
  return parts.join(' · ');
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    marginTop: 4,
  },
  heading: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headingTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  headingWeekday: {
    fontSize: 15,
    marginTop: 2,
  },
  empty: {
    fontSize: 17,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
});
