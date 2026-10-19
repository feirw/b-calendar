import assert from 'node:assert/strict';
import test from 'node:test';

import {
  celebrationMonthDay,
  daysUntil,
  nextBirthday,
  turningAge,
} from './birthdays.ts';

test('next birthday stays in the current year when it has not happened yet', () => {
  const today = new Date(2026, 0, 10);
  const next = nextBirthday(3, 15, today);
  assert.deepEqual([next.getFullYear(), next.getMonth() + 1, next.getDate()], [2026, 3, 15]);
});

test('next birthday rolls into the next year after the day has passed', () => {
  const today = new Date(2026, 11, 31);
  const next = nextBirthday(1, 5, today);
  assert.deepEqual([next.getFullYear(), next.getMonth() + 1, next.getDate()], [2027, 1, 5]);
});

test('a birthday today is the next occurrence', () => {
  const today = new Date(2026, 9, 19, 22, 30);
  const next = nextBirthday(10, 19, today);
  assert.equal(daysUntil(next, today), 0);
  assert.deepEqual([next.getFullYear(), next.getMonth() + 1, next.getDate()], [2026, 10, 19]);
});

test('February 29 stays on February 29 in a leap year', () => {
  assert.deepEqual(celebrationMonthDay(2, 29, 2028), { month: 2, day: 29 });
  const next = nextBirthday(2, 29, new Date(2028, 0, 1));
  assert.deepEqual([next.getFullYear(), next.getMonth() + 1, next.getDate()], [2028, 2, 29]);
});

test('February 29 is celebrated on February 28 in a non-leap year', () => {
  assert.deepEqual(celebrationMonthDay(2, 29, 2026), { month: 2, day: 28 });
  const next = nextBirthday(2, 29, new Date(2026, 0, 1));
  assert.deepEqual([next.getFullYear(), next.getMonth() + 1, next.getDate()], [2026, 2, 28]);
});

test('February 29 after February 28 in a non-leap year moves to the next celebration', () => {
  const next = nextBirthday(2, 29, new Date(2026, 2, 1));
  assert.deepEqual([next.getFullYear(), next.getMonth() + 1, next.getDate()], [2027, 2, 28]);
});

test('age is the year of the celebration minus the birth year', () => {
  const occurrence = nextBirthday(2, 29, new Date(2026, 0, 1));
  assert.equal(turningAge(2000, occurrence), 26);
});

test('age is omitted when the birth year is unknown', () => {
  const occurrence = nextBirthday(5, 1, new Date(2026, 0, 1));
  assert.equal(turningAge(null, occurrence), null);
});
