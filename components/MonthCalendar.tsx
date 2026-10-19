import { useMemo } from 'react';
import { Calendar, LocaleConfig, type DateData } from 'react-native-calendars';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/components/useThemeColors';
import { useI18n } from '@/i18n';
import { celebrationKey, dateKey } from '@/lib/birthdays';
import { MONTHS_NOMINATIVE, WEEKDAYS_LONG, WEEKDAYS_SHORT } from '@/lib/calendarText';
import type { Birthday } from '@/store/birthdays';

const HEADER_WEEKDAYS = {
  el: ['Κυ', 'Δε', 'Τρ', 'Τε', 'Πε', 'Πα', 'Σα'],
  en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
} as const;

type MonthCalendarProps = {
  birthdays: Birthday[];
  selected: Date;
  visible: Date;
  onSelect: (date: Date) => void;
  onVisibleMonthChange: (date: Date) => void;
};

export function MonthCalendar({
  birthdays,
  selected,
  visible,
  onSelect,
  onVisibleMonthChange,
}: MonthCalendarProps) {
  const colors = useThemeColors();
  const { locale } = useI18n();

  LocaleConfig.locales[locale] = {
    monthNames: [...MONTHS_NOMINATIVE[locale]],
    monthNamesShort: [...MONTHS_NOMINATIVE[locale]],
    dayNames: [...WEEKDAYS_LONG[locale]],
    dayNamesShort: [...HEADER_WEEKDAYS[locale]],
    today: locale === 'el' ? 'Σήμερα' : 'Today',
  };
  LocaleConfig.defaultLocale = locale;

  const markedDates = useMemo(() => {
    const marks: Record<string, { marked?: boolean; selected?: boolean }> = {};
    const years = [visible.getFullYear() - 1, visible.getFullYear(), visible.getFullYear() + 1];
    for (const year of years) {
      for (const birthday of birthdays) {
        marks[celebrationKey(birthday.month, birthday.day, year)] = { marked: true };
      }
    }
    const selectedKey = dateKey(selected.getFullYear(), selected.getMonth() + 1, selected.getDate());
    marks[selectedKey] = { ...(marks[selectedKey] ?? {}), selected: true };
    return marks;
  }, [birthdays, selected, visible]);

  return (
    <Calendar
      firstDay={1}
      hideExtraDays={false}
      enableSwipeMonths
      showSixWeeks
      markedDates={markedDates}
      onDayPress={(day) => onSelect(new Date(day.year, day.month - 1, day.day))}
      onMonthChange={(month) => onVisibleMonthChange(new Date(month.year, month.month - 1, 1))}
      dayComponent={(props) => (
        <AppleDay
          date={props.date}
          state={props.state}
          marked={Boolean(props.marking?.marked)}
          selected={Boolean(props.marking?.selected)}
          onPress={props.onPress}
          todayColor={colors.today}
          textColor={colors.text}
          mutedColor={colors.quaternary}
          selectedColor={colors.selectedDay}
        />
      )}
      theme={{
        calendarBackground: 'transparent',
        monthTextColor: colors.text,
        textMonthFontSize: 22,
        textMonthFontWeight: '700',
        textSectionTitleColor: colors.secondary,
        textDayHeaderFontSize: 12,
        textDayHeaderFontWeight: '600',
        arrowColor: colors.today,
      }}
      style={styles.calendar}
    />
  );
}

function AppleDay({
  date,
  state,
  marked,
  selected,
  onPress,
  todayColor,
  textColor,
  mutedColor,
  selectedColor,
}: {
  date?: DateData | string;
  state?: string;
  marked: boolean;
  selected: boolean;
  onPress?: (date?: DateData) => void;
  todayColor: string;
  textColor: string;
  mutedColor: string;
  selectedColor: string;
}) {
  const data = date && typeof date === 'object' ? date : undefined;
  if (!data) {
    return <View style={styles.day} />;
  }

  const isToday = state === 'today';
  const isDisabled = state === 'disabled';

  return (
    <Pressable accessibilityRole="button" onPress={() => onPress?.(data)} style={styles.day}>
      <View
        style={[
          styles.circle,
          isToday ? { backgroundColor: todayColor } : null,
          selected && !isToday ? { backgroundColor: selectedColor } : null,
        ]}>
        <Text
          style={[
            styles.dayText,
            {
              color: isToday ? '#FFFFFF' : isDisabled ? mutedColor : textColor,
              fontWeight: isToday || selected ? '600' : '400',
            },
          ]}>
          {data.day}
        </Text>
      </View>
      <View style={[styles.dot, { backgroundColor: marked ? todayColor : 'transparent' }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  calendar: {
    backgroundColor: 'transparent',
  },
  day: {
    width: '100%',
    height: 46,
    alignItems: 'center',
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 16,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 2,
  },
});
