import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { useThemeColors } from '@/components/useThemeColors';
import { useI18n } from '@/i18n';
import { weekdayShort } from '@/lib/calendarText';
import type { UpcomingEntry } from '@/lib/upcoming';

type BirthdayRowProps = {
  entry: UpcomingEntry;
  showDate?: boolean;
  subtitle: string;
};

export function BirthdayRow({ entry, showDate = true, subtitle }: BirthdayRowProps) {
  const colors = useThemeColors();
  const { locale } = useI18n();
  const isToday = entry.days === 0;
  const dateColor = isToday ? colors.today : colors.secondary;
  const dayColor = isToday ? colors.today : colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() =>
        router.push({ pathname: '/birthday/[id]', params: { id: entry.birthday.id } })
      }
      style={[styles.row, isToday ? { backgroundColor: colors.todayFill } : null]}>
      {showDate ? (
        <View style={styles.date}>
          <Text style={[styles.weekday, { color: dateColor }]}>
            {weekdayShort(locale, entry.occurrence)}
          </Text>
          <Text style={[styles.day, { color: dayColor }]}>{entry.occurrence.getDate()}</Text>
        </View>
      ) : null}
      <View style={styles.text}>
        <Text numberOfLines={1} style={[styles.name, { color: colors.text }]}>
          {entry.birthday.name}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={[styles.subtitle, { color: colors.secondary }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Avatar name={entry.birthday.name} photoFileName={entry.birthday.photoFileName} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  date: {
    width: 44,
    alignItems: 'center',
  },
  weekday: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  day: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 1,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
  },
});
