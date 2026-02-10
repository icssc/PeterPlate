import { create } from "zustand";

type SnackbarSeverity = "success" | "error" | "info" | "warning";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;

  showSnackbar: (message: string, severity?: SnackbarSeverity) => void;
  closeSnackbar: () => void;
}

export const useSnackbarStore = create<SnackbarState>((set) => ({
  open: false,
  message: "",
  severity: "info",

  showSnackbar: (message, severity = "info") =>
    set({
      open: true,
      message,
      severity,
    }),

  closeSnackbar: () =>
    set({
      open: false,
    }),
}));
