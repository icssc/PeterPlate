import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  userId: string | null;
  hasOnboarded: boolean;
  hasOnboardedMealTracker: boolean;
  isInitialized: boolean;
  setUserId: (id: string | null) => void;
  setHasOnboarded: (val: boolean) => void;
  setHasOnboardedMealTracker: (val: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      hasOnboarded: false,
      hasOnboardedMealTracker: false,
      isInitialized: false,
      setUserId: (id) => set({ userId: id }),
      setHasOnboarded: (val) => set({ hasOnboarded: val }),
      setHasOnboardedMealTracker: (val) =>
        set({ hasOnboardedMealTracker: val }),
      clearUser: () => set({ userId: null }),
    }),
    {
      name: "user-storage",
    },
  ),
);
