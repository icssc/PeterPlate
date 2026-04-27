import { classifyEvent } from "@/utils/classifyEvent";

export default function EventTypeBadge({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  const type = classifyEvent(title, desc);
  return (
    <span className="absolute bottom-3 right-3 bg-white/80 text-black text-sm font-medium px-4 py-1.5 rounded-full shadow-md">
      {type}
    </span>
  );
}
