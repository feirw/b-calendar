import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Birthday = {
  id: string;
  name: string;
  month: number;
  day: number;
  year: number | null;
  note: string;
  photoFileName: string | null;
};

type BirthdayStore = {
  birthdays: Birthday[];
  save: (birthday: Birthday) => void;
  remove: (id: string) => void;
};

export const useBirthdayStore = create<BirthdayStore>()(
  persist(
    (set) => ({
      birthdays: [],
      save: (birthday) =>
        set((state) => {
          const index = state.birthdays.findIndex((item) => item.id === birthday.id);
          if (index === -1) {
            return { birthdays: [...state.birthdays, birthday] };
          }
          const birthdays = [...state.birthdays];
          birthdays[index] = birthday;
          return { birthdays };
        }),
      remove: (id) =>
        set((state) => ({
          birthdays: state.birthdays.filter((item) => item.id !== id),
        })),
    }),
    {
      name: 'birthdays',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);

export function useBirthdaysHydrated() {
  const [hydrated, setHydrated] = useState(useBirthdayStore.persist.hasHydrated());

  useEffect(() => {
    setHydrated(useBirthdayStore.persist.hasHydrated());
    return useBirthdayStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}
