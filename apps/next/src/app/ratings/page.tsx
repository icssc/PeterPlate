"use client";

import { Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import RatingsCard from "@/components/ui/card/ratings-card";
import LoadingSpinner from "@/components/ui/loading-spinner";
import MealDivider from "@/components/ui/meal-divider";
import PageContainer from "@/components/ui/page-container";
import { useSnackbarStore } from "@/context/useSnackbar";
import { useUserStore } from "@/context/useUserStore";
import { trpc } from "@/utils/trpc";

export default function RatedFoods() {
  const router = useRouter();
  const { userId, isInitialized } = useUserStore();
  const { showSnackbar } = useSnackbarStore();

  useEffect(() => {
    if (!isInitialized) return;

    if (!userId) {
      showSnackbar("Login to rate meals!", "error");
      router.push("/");
    }
  }, [userId, isInitialized, router, showSnackbar]);

  const {
    data: ratedFoods,
    isLoading,
    error,
  } = trpc.dish.rated.useQuery(
    {
      userId: userId ?? "",
    },
    {
      enabled: !!userId,
    },
  );

  return (
    <div className="max-w-full min-h-screen">
      <div className="z-0 flex flex-col overflow-x-hidden">
        <div className="relative w-full h-80">
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 to-transparent" />
          <Image
            className="object-cover w-full h-full"
            src="/aldrich.webp"
            alt="An Image of Aldrich Park."
            width={2000}
            height={2000}
          />
        </div>

        <PageContainer className="flex flex-col gap-4" id="food-scroll">
          <MealDivider title="My Rated Foods" />

          {isLoading && (
            <div className="flex justify-center mt-8">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <p className="text-red-500 w-full text-center">
              Error: {error.message}
            </p>
          )}

          {!isLoading &&
            !error &&
            (ratedFoods && ratedFoods.length > 0 ? (
              ratedFoods.map((food: (typeof ratedFoods)[number]) => (
                <RatingsCard key={`${food.id}|${food.ratedAt}`} food={food} />
              ))
            ) : (
              <Typography
                variant="body1"
                color="text.secondary"
                className="py-5"
              >
                You haven't rated any foods yet
              </Typography>
            ))}
        </PageContainer>
      </div>
    </div>
  );
}
