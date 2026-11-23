import type React from "react";
import { cn } from "@/utils/tw";

/** Wraps a page so every page has the same width, side margins and top spacing. */
export default function PageContainer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1440px] px-4 pt-6 pb-8 md:px-10 xl:px-[72px]",
        className,
      )}
      {...props}
    />
  );
}
