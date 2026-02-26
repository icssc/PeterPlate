"use client";

const CIRCLE_RADIUS = 40;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

interface Props {
  /**
   * The progress chart will show progress_value / max_value
   */
  progress_value: number;

  /**
   * The progress chart will show progress_value / max_value
   */
  max_value: number;

  /**
   * The unit of measurement to display within the progress donut. Ex: 'g' for grams
   */
  display_unit: string;
}

export function ProgressDonut({
  progress_value,
  max_value,
  display_unit,
}: Props) {
  const value = Math.max(0, Math.min(progress_value, max_value));
  const percent = value / max_value;
  const strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - percent);

  return (
    <div className="flex flex-col items-center justify-center p-4 pt-0">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <title>Progress Donut</title>
          <circle
            cx="50"
            cy="50"
            r={CIRCLE_RADIUS}
            stroke="#e5e7eb"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r={CIRCLE_RADIUS}
            stroke="#3b82f6"
            strokeWidth="10"
            fill="none"
            strokeDasharray={CIRCLE_CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{ transition: "stroke-dashoffset 0.4s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold">
            {progress_value}
            {display_unit}
          </span>
          <span className="text-sm text-muted-foreground">/ {max_value}</span>
        </div>
      </div>
    </div>
  );
}
