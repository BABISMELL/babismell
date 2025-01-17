import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

interface CountdownState {
  isEnabled: boolean;
  endDate: string;
  title: string;
  description: string;
}

const initialState: CountdownState = {
  isEnabled: true,
  endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  title: 'Vente Flash',
  description: 'Profitez de nos offres exceptionnelles'
};

export const countdownAtom = atomWithStorage<CountdownState>('countdown', initialState);

export const countdownEnabledAtom = atom(
  (get) => get(countdownAtom).isEnabled,
  (get, set, isEnabled: boolean) => {
    const current = get(countdownAtom);
    set(countdownAtom, { ...current, isEnabled });
  }
);

export const countdownEndDateAtom = atom(
  (get) => get(countdownAtom).endDate,
  (get, set, endDate: string) => {
    const current = get(countdownAtom);
    set(countdownAtom, { ...current, endDate });
  }
);

export const countdownTitleAtom = atom(
  (get) => get(countdownAtom).title,
  (get, set, title: string) => {
    const current = get(countdownAtom);
    set(countdownAtom, { ...current, title });
  }
);

export const countdownDescriptionAtom = atom(
  (get) => get(countdownAtom).description,
  (get, set, description: string) => {
    const current = get(countdownAtom);
    set(countdownAtom, { ...current, description });
  }
);