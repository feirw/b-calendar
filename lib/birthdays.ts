import { differenceInCalendarDays } from 'date-fns/differenceInCalendarDays';
import { isLeapYear as dateIsLeapYear } from 'date-fns/isLeapYear';
import { startOfDay } from 'date-fns/startOfDay';

/**
 * When a birthday is on 29 February and the year is not a leap year,
 * it is celebrated on this day instead. Change this one value to move that rule.
 */
export const NON_LEAP_FEB29 = { month: 2, day: 28 } as const;

export function startOfLocalDay(date: Date): Date {
  return startOfDay(date);
}

export function isLeapYear(year: number): boolean {
  return dateIsLeapYear(new Date(year, 0, 1));
}

export function celebrationMonthDay(
  month: number,
  day: number,
  year: number,
): { month: number; day: number } {
  if (month === 2 && day === 29 && !isLeapYear(year)) {
    return { month: NON_LEAP_FEB29.month, day: NON_LEAP_FEB29.day };
  }
  return { month, day };
}

export function nextBirthday(month: number, day: number, today: Date): Date {
  const start = startOfLocalDay(today);
  const year = start.getFullYear();
  const thisYear = celebrationMonthDay(month, day, year);
  const candidate = new Date(year, thisYear.month - 1, thisYear.day);
  if (candidate.getTime() >= start.getTime()) {
    return candidate;
  }
  const nextYear = celebrationMonthDay(month, day, year + 1);
  return new Date(year + 1, nextYear.month - 1, nextYear.day);
}

export function turningAge(birthYear: number | null, occurrence: Date): number | null {
  if (birthYear == null) {
    return null;
  }
  return occurrence.getFullYear() - birthYear;
}

export function daysUntil(occurrence: Date, today: Date): number {
  return differenceInCalendarDays(occurrence, today);
}

export function dateKey(year: number, month: number, day: number): string {
  const monthText = String(month).padStart(2, '0');
  const dayText = String(day).padStart(2, '0');
  return `${year}-${monthText}-${dayText}`;
}

export function celebrationKey(month: number, day: number, year: number): string {
  const celebrated = celebrationMonthDay(month, day, year);
  return dateKey(year, celebrated.month, celebrated.day);
}

export function dateFromKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}
