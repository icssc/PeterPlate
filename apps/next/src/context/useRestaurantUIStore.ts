import { create } from "zustand";

/**
 * UI state for the restaurant page — period/station selection, view toggles,
 * popover anchors, and date picker open state.
 *
 * Stored in Zustand so all sub-components (tabs, filters, mobile actions) can
 * read and update this without prop drilling through RestaurantControls.
 */
interface RestaurantUIState {
  // Meal period
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;

  // Station
  selectedStation: string;
  setSelectedStation: (station: string) => void;

  // View mode
  isCompactView: boolean;
  setIsCompactView: (isCompact: boolean) => void;

  // Preferences filter
  showPreferencesOnly: boolean;
  setShowPreferencesOnly: (show: boolean) => void;

  // Date picker open state
  isDatePickerOpen: boolean;
  setIsDatePickerOpen: (isOpen: boolean) => void;

  // Popover anchors (not serialisable — not persisted)
  menuAnchor: HTMLElement | null;
  setMenuAnchor: (el: HTMLElement | null) => void;
  scheduleAnchor: HTMLElement | null;
  setScheduleAnchor: (el: HTMLElement | null) => void;
}

export const useRestaurantUIStore = create<RestaurantUIState>()((set) => ({
  selectedPeriod: "",
  setSelectedPeriod: (period) => set({ selectedPeriod: period }),

  selectedStation: "",
  setSelectedStation: (station) => set({ selectedStation: station }),

  isCompactView: false,
  setIsCompactView: (isCompact) => set({ isCompactView: isCompact }),

  showPreferencesOnly: false,
  setShowPreferencesOnly: (show) => set({ showPreferencesOnly: show }),

  isDatePickerOpen: false,
  setIsDatePickerOpen: (isOpen) => set({ isDatePickerOpen: isOpen }),

  menuAnchor: null,
  setMenuAnchor: (el) => set({ menuAnchor: el }),

  scheduleAnchor: null,
  setScheduleAnchor: (el) => set({ scheduleAnchor: el }),
}));
