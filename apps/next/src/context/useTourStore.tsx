import { create } from "zustand";

type TourState = {
  running: boolean;
  launchId: number;
  start: () => void;
  stop: () => void;
};

export const useTourStore = create<TourState>((set) => ({
  running: false,
  launchId: 0,
  start: () =>
    set((state) => ({
      running: true,
      launchId: state.launchId + 1,
    })),
  stop: () => set({ running: false }),
}));
