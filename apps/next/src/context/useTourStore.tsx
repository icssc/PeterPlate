import { create } from "zustand";

export type TourId = "nutrition" | "events" | "my-foods";

type TourState = {
  activeTour: TourId | null;
  launchId: number;
  start: (tourId: TourId) => void;
  stop: () => void;
};

export const useTourStore = create<TourState>((set) => ({
  activeTour: null,
  launchId: 0,
  start: (tourId) =>
    set((state) => ({
      activeTour: tourId,
      launchId: state.launchId + 1,
    })),
  stop: () => set({ activeTour: null }),
}));
