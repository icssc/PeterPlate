import { cn } from "@/utils/tw";
import { HallStatusEnum } from "@/utils/types";

/**
 * Props for the StatusDot component.
 */
interface StatusDotProps {
  /** The current status to display. */
  status: HallStatusEnum;
}

/**
 * Renders a colored dot indicating a status of a dining hall.
 * @param {StatusDotProps} props - The props for the component.
 * @returns A JSX element representing the status dot.
 */
function StatusDot({ status }: StatusDotProps) {
  return (
    <div
      className={cn(
        "w-2 h-2 rounded-full",
        status === HallStatusEnum.OPEN && "bg-emerald-500",
        status === HallStatusEnum.CLOSED && "bg-red-500",
        status === HallStatusEnum.PREVIEW && "bg-sky-500",
        status === HallStatusEnum.ERROR && "bg-amber-500",
      )}
    />
  );
}

/**
 * Props for the DiningHallStatus component.
 */
interface StatusProps {
  /** The current status of the dining hall. */
  status: HallStatusEnum;
  /** The opening time of the dining hall (if applicable). */
  openTime: string;
  /** The closing time of the dining hall (if applicable). */
  closeTime: string;
}

/**
 * Renders the status of a dining hall, including a status dot and a descriptive message.
 * @param {StatusProps} props - The props for the component.
 * @returns A JSX element representing the dining hall status.
 */
function DiningHallStatus({
  status,
  openTime,
  closeTime,
}: StatusProps): JSX.Element {
  let statusMessage: string = "";

  switch (status) {
    case HallStatusEnum.OPEN:
      statusMessage = `Open (${openTime} - ${closeTime})`;
      break;
    case HallStatusEnum.CLOSED:
      statusMessage = `Closed`;
      break;
    case HallStatusEnum.ERROR:
      statusMessage = `Error (Cannot obtain scheduling info)`;
      break;
    case HallStatusEnum.PREVIEW:
      statusMessage = `Preview`;
      break;
    default:
      break;
  }

  return (
    <div className="flex items-center gap-2">
      <StatusDot status={status} />
      <span>{statusMessage}</span>
    </div>
  );
}

export { DiningHallStatus };
