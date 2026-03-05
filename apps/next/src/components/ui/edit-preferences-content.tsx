"use client";

import {
  Avatar,
  Button,
  CircularProgress,
  MobileStepper,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSession } from "@/utils/auth-client";
import { trpc } from "@/utils/trpc";
import {
  AllergenKeys,
  PreferenceKeys,
} from "../../../../../packages/validators/src/adobe-ecommerce";

type EditPreferencesContentProps = {
  onSaved?: () => void;
};

export default function EditPreferencesContent({
  onSaved,
}: EditPreferencesContentProps) {
  const { data: session } = useSession();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMounted = useRef(true);

  const [formData, setFormData] = useState({
    allergies: [] as string[],
    preferences: [] as string[],
  });

  const utils = trpc.useUtils();
  const isGuest = !session?.user;

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const { data: existingAllergies, isLoading: loadingAllergies } =
    trpc.allergy.getAllergies.useQuery(
      { userId: session?.user?.id ?? "" },
      { enabled: !!session?.user?.id },
    );

  const { data: existingPreferences, isLoading: loadingPrefs } =
    trpc.preference.getDietaryPreferences.useQuery(
      { userId: session?.user?.id ?? "" },
      { enabled: !!session?.user?.id },
    );

  useEffect(() => {
    if (existingAllergies || existingPreferences) {
      setFormData({
        allergies: existingAllergies || [],
        preferences: existingPreferences || [],
      });
    }
  }, [existingAllergies, existingPreferences]);

  const addAllergies = trpc.allergy.addAllergies.useMutation();
  const addPreferences = trpc.preference.addDietaryPreferences.useMutation();
  const deleteAllergy = trpc.allergy.deleteAllergy.useMutation();
  const deletePreference = trpc.preference.deletePreference.useMutation();

  const handleToggle = (key: keyof typeof formData, newValues: string[]) => {
    setFormData((prev) => ({
      ...prev,
      [key]: newValues,
    }));
  };

  const handleSubmit = async () => {
    if (!session?.user?.id || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const userId = session.user.id;

      // 1. Handle allergies
      const allergiesToDelete =
        existingAllergies?.filter((x) => !formData.allergies.includes(x)) || [];

      await Promise.all([
        ...allergiesToDelete.map((allergy) =>
          deleteAllergy.mutateAsync({ userId, allergy }),
        ),
        addAllergies.mutateAsync({ userId, allergies: formData.allergies }),
      ]);

      // 2. Handle preferences
      const prefsToDelete =
        existingPreferences?.filter((x) => !formData.preferences.includes(x)) ||
        [];

      await Promise.all([
        ...prefsToDelete.map((preference) =>
          deletePreference.mutateAsync({ userId, preference }),
        ),
        addPreferences.mutateAsync({
          userId,
          preferences: formData.preferences,
        }),
      ]);

      await Promise.all([
        utils.allergy.getAllergies.invalidate(),
        utils.preference.getDietaryPreferences.invalidate(),
      ]);

      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      console.error("Save failed", error);
      if (isMounted.current) {
        setIsSubmitting(false);
      }
    }
  };

  const handleNext = () => setActiveStep(1);
  const handleBack = () => setActiveStep(0);

  if (loadingAllergies || loadingPrefs) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Header Section (Re-used for both steps) */}
      <div className="bg-sky-700 py-5 flex flex-col items-center gap-1">
        <Avatar src="/peterplate-icon.webp" className="!w-[60px] !h-[60px]" />
        <Typography variant="h5" color="white" fontWeight={700}>
          Edit Preferences
        </Typography>
        <Typography color="white">
          {isGuest
            ? "Log in to update your profile"
            : "Update your dining profile"}
        </Typography>
      </div>

      <div className="px-10 pt-5 h-[320px] overflow-y-auto">
        {activeStep === 0 ? (
          <>
            <Typography variant="h5" fontWeight={700} className="text-sky-700">
              Food Allergies
            </Typography>
            <Typography color="gray" className="pt-4 mb-3">
              Help us keep you safe by selecting your food allergies (optional)
            </Typography>
            <Tooltip title={isGuest ? "Log in to edit preferences" : ""} arrow>
              <div>
                <ToggleButtonGroup
                  value={formData.allergies}
                  onChange={(_, val) => handleToggle("allergies", val)}
                  disabled={isGuest}
                  fullWidth
                  className="grid grid-cols-2 gap-2"
                >
                  {AllergenKeys.map((opt) => (
                    <ToggleButton
                      key={opt}
                      value={opt}
                      className="!py-3 !normal-case !text-black !h-10 transition-all duration-200 [&.Mui-selected]:!bg-[rgba(0,105,168,0.2)] [&.Mui-selected]:!text-[#0069A8] [&.Mui-selected]:!border-[#0069A8] hover:!bg-gray-100"
                    >
                      {opt}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </div>
            </Tooltip>
          </>
        ) : (
          <>
            <Typography variant="h5" fontWeight={700} className="text-sky-700">
              Dietary Preferences
            </Typography>
            <Typography color="gray" className="pt-4 mb-3">
              Select any dietary restrictions that apply to you (optional)
            </Typography>
            <Tooltip title={isGuest ? "Log in to edit preferences" : ""} arrow>
              <div>
                <ToggleButtonGroup
                  value={formData.preferences}
                  onChange={(_, val) => handleToggle("preferences", val)}
                  disabled={isGuest}
                  fullWidth
                  className="grid grid-cols-2 gap-2"
                >
                  {PreferenceKeys.map((opt) => (
                    <ToggleButton
                      key={opt}
                      value={opt}
                      className="!py-3 !normal-case !text-black !h-10 transition-all duration-200 [&.Mui-selected]:!bg-[rgba(0,105,168,0.2)] [&.Mui-selected]:!text-[#0069A8] [&.Mui-selected]:!border-[#0069A8] hover:!bg-gray-100"
                    >
                      {opt}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </div>
            </Tooltip>
          </>
        )}
      </div>

      <MobileStepper
        variant="text"
        steps={2}
        position="static"
        activeStep={activeStep}
        className="px-10 pb-5"
        nextButton={
          <Button
            variant="contained"
            size="small"
            disabled={isSubmitting || isGuest}
            onClick={activeStep === 1 ? handleSubmit : handleNext}
            className="!h-[45px] !w-24 !bg-[#0069A8]"
          >
            {activeStep === 1 ? (isSubmitting ? "Saving..." : "Save") : "Next"}
          </Button>
        }
        backButton={
          <Button
            variant="contained"
            size="small"
            disabled={activeStep === 0 || isSubmitting}
            onClick={handleBack}
            className="!h-[45px] !w-24 !bg-[#0069A8]"
          >
            Back
          </Button>
        }
      />
    </div>
  );
}
