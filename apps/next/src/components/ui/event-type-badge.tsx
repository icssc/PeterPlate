import { classifyEvent } from "@/utils/classifyEvent";

export default function EventTypeBadge({ title }: { title: string }) {
  const type = classifyEvent(title);
  return (
    <span className="absolute bottom-3 right-3 bg-white/80 text-black text-sm font-medium px-4 py-1.5 rounded-full shadow-md">
      {type}
    </span>
  );
}
