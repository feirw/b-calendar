import type { Birthday } from '@/store/birthdays';

import { daysUntil, nextBirthday, turningAge } from '@/lib/birthdays';

export type UpcomingEntry = {
  birthday: Birthday;
  occurrence: Date;
  days: number;
  age: number | null;
};

export function upcomingEntries(birthdays: Birthday[], today: Date): UpcomingEntry[] {
  return birthdays
    .map((birthday) => {
      const occurrence = nextBirthday(birthday.month, birthday.day, today);
      return {
        birthday,
        occurrence,
        days: daysUntil(occurrence, today),
        age: turningAge(birthday.year, occurrence),
      };
    })
    .sort(
      (a, b) =>
        a.occurrence.getTime() - b.occurrence.getTime() ||
        a.birthday.name.localeCompare(b.birthday.name, 'el'),
    );
}
