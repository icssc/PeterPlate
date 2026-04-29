import { getEventType } from "@/utils/funcs";

export default function EventTypeBadge({ title }: { title: string }) {
  const type = getEventType(title);
  if (type !== "celebration" && type !== "special") return null;
  return (
    <span className="absolute bottom-3 right-3 bg-white text-black dark:bg-[#303035] dark:text-white text-sm font-medium px-4 py-1.5 rounded-full shadow-md">
      {type === "celebration" ? "Celebration" : "Special Meal"}
    </span>
  );
}
