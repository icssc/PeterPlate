import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  userId: string | null;
  hasOnboarded: boolean;
  // TODO: hasOnboardedMealTracker
  isInitialized: boolean;
  setUserId: (id: string | null) => void;
  setHasOnboarded: (val: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      hasOnboarded: false,
      // hasOnboardedMealTracker: false
      isInitialized: false,
      setUserId: (id) => set({ userId: id }),
      setHasOnboarded: (val) => set({ hasOnboarded: val }),
      // setHasOnboardedMealTracker: (val) =>  set({ hasMealTrackerOnboarded: val }),
      clearUser: () => set({ userId: null }),
    }),
    {
      name: "user-storage",
    },
  ),
);
