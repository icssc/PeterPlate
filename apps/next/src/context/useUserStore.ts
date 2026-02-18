import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  userId: string | null;
  isInitialized: boolean;
  setUserId: (id: string | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      isInitialized: false,
      setUserId: (id) => set({ userId: id, isInitialized: true }),
      clearUser: () => set({ userId: null, isInitialized: true }),
    }),
    {
      name: "user-storage", // saves to localStorage
    },
  ),
);
