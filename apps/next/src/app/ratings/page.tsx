"use client";

import MealDivider from "@/components/ui/meal-divider";
import { trpc } from "@/utils/trpc";
import Image from "next/image";
import RatingsCard from "@/components/ui/card/ratings-card";
import { useRouter } from "next/navigation";
import { useSession } from "@/utils/auth-client";
import { useEffect } from "react";

export default function RatedFoods() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  useEffect(() => {
    // TODO: use sonner or toast instead of alerts
    // to avoid duplicate warning
    if (!isPending && !user?.id) {
      alert("You must be logged in to track meals");
      router.push("/");
    }
  }, [user]);

  const {
    data: ratedFoods,
    isLoading,
    error,
  } = trpc.dish.rated.useQuery({
    userId: user?.id
  }, {
    enabled: !!user?.id
  });

  return (
    <div className="max-w-full h-screen">
      <div className="z-0 flex flex-col h-full overflow-x-hidden">
        <Image
          className="object-cover w-full min-h-80 max-h-80"
          src="/aldrich.webp"
          alt="An Image of Aldrich Park."
          width={2000}
          height={2000}
        />

        <div
          className="flex flex-col gap-4 justify-center w-full p-5 sm:px-12 sm:py-8"
          id="food-scroll"
        >
          <MealDivider title="My Rated Foods" />

          {isLoading && <p className="text-center">Loading your ratings...</p>}

          {error && (
            <p className="text-red-500 w-full text-center">
              Error: {error.message}
            </p>
          )}

          {!isLoading && !error && (
            <>
              {ratedFoods && ratedFoods.length > 0 ? (
                ratedFoods.map((food: (typeof ratedFoods)[number]) => (
                  <RatingsCard key={`${food.id}|${food.ratedAt}`} food={food} userId={user?.id} />
                ))
              ) : (
                <p className="text-center text-zinc-700 py-5">
                  You haven't rated any foods yet
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
