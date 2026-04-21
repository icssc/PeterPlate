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

  /**
   * ring colors, passing props to add custom colors to certain goals
   */
  trackColor?: string;
  progressColor?: string;
}

export function ProgressDonut({
  progress_value,
  max_value,
  display_unit,
  trackColor = "#ffffff",
  progressColor = "#0084D1",
}: Props) {
  const value = Math.max(0, Math.min(progress_value, max_value));
  const percent = value / max_value;
  const strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - percent);

  return (
    <div className="flex flex-col justify-center -ml-4 translate-y-2">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <title>Progress Donut</title>
          {/* outer translucent white circle */}
          <circle cx="50" cy="50" r="30" fill="white" fillOpacity="0.5" />
          {/* inner white circle */}
          <circle cx="50" cy="50" r="25" fill="white" fillOpacity="0.9" />
          {/* background arc track - semicircle */}
          <circle
            cx="50"
            cy="50"
            r={CIRCLE_RADIUS}
            stroke={trackColor}
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${CIRCLE_CIRCUMFERENCE * 0.75} ${CIRCLE_CIRCUMFERENCE * 0.25}`}
            transform="rotate(135 50 50)"
          />
          {/* progress arc */}
          <circle
            cx="50"
            cy="50"
            r={CIRCLE_RADIUS}
            stroke={progressColor}
            strokeWidth="10"
            fill="none"
            strokeDasharray={`${CIRCLE_CIRCUMFERENCE * 0.75 * percent} ${CIRCLE_CIRCUMFERENCE}`}
            strokeLinecap="round"
            transform="rotate(135 50 50)"
            style={{ transition: "stroke-dashoffset 0.4s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold">
            {progress_value}
            {display_unit}
          </span>
          <span className="text-sm font-bold text-gray-400">/ {max_value}</span>
        </div>
      </div>
    </div>
  );
}
