"use client";

import Side from "@/components/ui/side";
import { HallEnum } from "@/utils/types";

export default function BrandywinePage() {
  return (
    <div className="h-screen overflow-y-auto">
      <Side hall={HallEnum.BRANDYWINE} />
    </div>
  );
}
