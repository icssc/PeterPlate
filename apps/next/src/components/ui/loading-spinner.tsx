import { CircularProgress, type CircularProgressProps } from "@mui/material";

/** The app's loading spinner: MUI's spinner with rounded ends and a faint track. */
export default function LoadingSpinner({
  size = "5rem",
}: Pick<CircularProgressProps, "size">) {
  return (
    <CircularProgress
      enableTrackSlot
      variant="indeterminate"
      color="primary"
      size={size}
      sx={{ circle: { strokeLinecap: "round" } }}
    />
  );
}
