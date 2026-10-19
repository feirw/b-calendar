import type { Locale } from '@/i18n/el';

export const MONTHS_NOMINATIVE: Record<Locale, readonly string[]> = {
  el: [
    'Ιανουάριος',
    'Φεβρουάριος',
    'Μάρτιος',
    'Απρίλιος',
    'Μάιος',
    'Ιούνιος',
    'Ιούλιος',
    'Αύγουστος',
    'Σεπτέμβριος',
    'Οκτώβριος',
    'Νοέμβριος',
    'Δεκέμβριος',
  ],
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
};

export const MONTHS_GENITIVE: Record<Locale, readonly string[]> = {
  el: [
    'Ιανουαρίου',
    'Φεβρουαρίου',
    'Μαρτίου',
    'Απριλίου',
    'Μαΐου',
    'Ιουνίου',
    'Ιουλίου',
    'Αυγούστου',
    'Σεπτεμβρίου',
    'Οκτωβρίου',
    'Νοεμβρίου',
    'Δεκεμβρίου',
  ],
  en: MONTHS_NOMINATIVE.en,
};

export const WEEKDAYS_SHORT: Record<Locale, readonly string[]> = {
  el: ['Κυρ', 'Δευ', 'Τρι', 'Τετ', 'Πεμ', 'Παρ', 'Σαβ'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

export const WEEKDAYS_LONG: Record<Locale, readonly string[]> = {
  el: ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};

export function monthNominative(locale: Locale, month: number): string {
  return MONTHS_NOMINATIVE[locale][month - 1] ?? '';
}

export function monthGenitive(locale: Locale, month: number): string {
  return MONTHS_GENITIVE[locale][month - 1] ?? '';
}

export function weekdayShort(locale: Locale, date: Date): string {
  return WEEKDAYS_SHORT[locale][date.getDay()] ?? '';
}

export function weekdayLong(locale: Locale, date: Date): string {
  return WEEKDAYS_LONG[locale][date.getDay()] ?? '';
}

export function formatDayMonth(locale: Locale, date: Date): string {
  return `${date.getDate()} ${monthGenitive(locale, date.getMonth() + 1)}`;
}

export function formatMonthYear(locale: Locale, date: Date): string {
  return `${monthNominative(locale, date.getMonth() + 1)} ${date.getFullYear()}`;
}
