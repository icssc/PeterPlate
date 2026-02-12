"use client";

import { useState } from "react";
import OnboardingDialog from "@/components/ui/onboarding";
import Side from "@/components/ui/side";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSession } from "@/utils/auth-client";
import { HallEnum } from "@/utils/types";

export default function Home() {
  const { data: session, isPending } = useSession();

  const [activeHall, setActiveHall] = useState<HallEnum>(HallEnum.BRANDYWINE);
  const isDesktop = useMediaQuery("(min-width: 768px)"); // Tailwind's `md` breakpoint

  // Desktop layout: two Side components side-by-side
  if (isDesktop) {
    return (
      <div className="grid grid-cols-2 h-screen">
        {((!isPending && !session) ||
          (session?.user && session.user.hasOnboarded === false)) && (
          <OnboardingDialog />
        )}
        <Side hall={HallEnum.BRANDYWINE} />
        <Side hall={HallEnum.ANTEATERY} />
      </div>
    );
  }

  const toggleHall = () => {
    if (activeHall === HallEnum.BRANDYWINE) setActiveHall(HallEnum.ANTEATERY);
    else setActiveHall(HallEnum.BRANDYWINE);
  };

  // Mobile layout: one Side component at a time with switcher
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-y-auto">
        {((!isPending && !session) ||
          (session?.user && session.user.hasOnboarded === false)) && (
          <OnboardingDialog />
        )}
        {activeHall === HallEnum.BRANDYWINE && (
          <Side hall={HallEnum.BRANDYWINE} toggleHall={toggleHall} />
        )}
        {activeHall === HallEnum.ANTEATERY && (
          <Side hall={HallEnum.ANTEATERY} toggleHall={toggleHall} />
        )}
      </div>
    </div>
  );
}
