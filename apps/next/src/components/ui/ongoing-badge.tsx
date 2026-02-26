export default function OngoingBadge() {
  return (
    <div className="flex rounded-full border-2 border-cyan-500 px-1 items-center gap-2">
      <div className="w-2 h-2 bg-cyan-500 rounded-md"></div>
      <strong className="text-cyan-500 font-medium">Ongoing</strong>
    </div>
  );
}
