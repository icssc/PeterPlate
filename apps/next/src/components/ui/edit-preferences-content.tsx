"use client";

import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
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
import { useEffect, useState } from "react";
import { useSession } from "@/utils/auth-client";
import { trpc } from "@/utils/trpc";
import {
  AllergenKeys,
  PreferenceKeys,
} from "../../../../../packages/validators/src/adobe-ecommerce";

export default function EditPreferencesContent() {
  const { data: session } = useSession();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    allergies: [] as string[],
    preferences: [] as string[],
  });
  const utils = trpc.useUtils();
  const isGuest = !session?.user; // Check if logged out

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

  const handleToggle = (key: keyof typeof formData, newValues: string[]) => {
    setFormData((prev) => ({
      ...prev,
      [key]: newValues,
    }));
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) return;
    setIsSubmitting(true);

    try {
      const allergiesToDelete =
        existingAllergies?.filter(
          (x: any) => !formData.allergies.includes(x),
        ) || [];

      await Promise.all(
        allergiesToDelete.map((allergy: any) =>
          trpc.allergy.deleteAllergy.mutateAsync({
            userId: session.user.id,
            allergy,
          }),
        ),
      );

      await addAllergies.mutateAsync({
        userId: session.user.id,
        allergies: formData.allergies,
      });

      const prefsToDelete =
        existingPreferences?.filter(
          (x: any) => !formData.preferences.includes(x),
        ) || [];
      await Promise.all(
        prefsToDelete.map((preference: any) =>
          trpc.preference.deletePreference.mutateAsync({
            userId: session.user.id,
            preference,
          }),
        ),
      );

      await addPreferences.mutateAsync({
        userId: session.user.id,
        preferences: formData.preferences,
      });

      await utils.allergy.getAllergies.invalidate();
      await utils.preference.getDietaryPreferences.invalidate();

      alert("Preferences updated successfully!");
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  if (loadingAllergies || loadingPrefs) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2 mb-2">
      {activeStep === 0 && (
        <div className="flex flex-col">
          <div className="bg-sky-700 py-5 flex flex-col items-center gap-1">
            <Avatar
              src="/peterplate-icon.webp"
              alt="PeterPlate Icon"
              className="!w-[60px] !h-[60px]"
            />
            <Typography
              variant="h5"
              fontFamily="Poppins, sans-serif"
              color="white"
              fontWeight={700}
            >
              Edit Preferences
            </Typography>
            <Typography fontFamily="Poppins, sans-serif" color="white">
              {isGuest
                ? "Log in to update your dining profile"
                : "Update your dining profile"}
            </Typography>
          </div>

          <div className="px-10 pt-5">
            <Typography
              variant="h5"
              fontFamily="Poppins, sans-serif"
              fontWeight={700}
              className="text-sky-700"
            >
              Food Allergies
            </Typography>
            <Typography
              fontFamily="Poppins, sans-serif"
              color="gray"
              fontSize={16}
              className="pt-4 mb-3"
            >
              Help us keep you safe by selecting your food allergies (optional)
            </Typography>
          </div>

          <Tooltip title={isGuest ? "Log in to edit preferences" : ""} arrow>
            <div className="px-10">
              <ToggleButtonGroup
                value={formData.allergies}
                onChange={(_, newValues) =>
                  handleToggle("allergies", newValues)
                }
                aria-label="select allergies"
                exclusive={false}
                fullWidth
                disabled={isGuest}
                className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 [&_.MuiToggleButtonGroup-grouped]:!border-2 [&_.MuiToggleButtonGroup-grouped]:!rounded-[10px] [&_.MuiToggleButtonGroup-grouped]:!border-gray-400"
              >
                {AllergenKeys.map((option) => (
                  <ToggleButton
                    key={option}
                    value={option}
                    className="!py-3 !normal-case !text-black !h-10 [&.Mui-selected]:!bg-[rgba(0,105,168,0.2)] [&.Mui-selected]:!text-[#0069A8] [&.Mui-selected]:!border-[#0069A8] [&.Mui-selected:hover]:!bg-[rgba(0,105,168,0.4)]"
                  >
                    <Typography
                      fontFamily="Poppins, sans-serif"
                      fontSize={16}
                      fontWeight={500}
                      lineHeight={1}
                    >
                      {option}
                    </Typography>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </div>
          </Tooltip>
        </div>
      )}
      {activeStep === 1 && (
        <div className="flex flex-col">
          <div className="bg-sky-700 py-5 flex flex-col items-center gap-1">
            <Avatar
              src="/peterplate-icon.webp"
              alt="PeterPlate Icon"
              className="!w-[60px] !h-[60px]"
            />
            <Typography
              variant="h5"
              fontFamily="Poppins, sans-serif"
              color="white"
              fontWeight={700}
            >
              Edit Preferences
            </Typography>
            <Typography fontFamily="Poppins, sans-serif" color="white">
              {isGuest
                ? "Log in to update your dining profile"
                : "Update your dining profile"}
            </Typography>
          </div>

          <div className="px-10 pt-5">
            <Typography
              variant="h5"
              fontFamily="Poppins, sans-serif"
              fontWeight={700}
              className="text-sky-700"
            >
              Dietary Preferences
            </Typography>
            <Typography
              fontFamily="Poppins, sans-serif"
              color="gray"
              fontSize={16}
              className="pt-4"
            >
              Select any dietary restrictions that apply to you (optional)
            </Typography>
          </div>

          <Tooltip title={isGuest ? "Log in to edit preferences" : ""} arrow>
            <div className="px-10">
              <ToggleButtonGroup
                value={formData.preferences}
                onChange={(_, newValues) =>
                  handleToggle("preferences", newValues)
                }
                aria-label="select preferences"
                exclusive={false}
                fullWidth
                disabled={isGuest}
                className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 [&_.MuiToggleButtonGroup-grouped]:!border-2 [&_.MuiToggleButtonGroup-grouped]:!rounded-[10px] [&_.MuiToggleButtonGroup-grouped]:!border-gray-400"
              >
                {PreferenceKeys.map((option) => (
                  <ToggleButton
                    key={option}
                    value={option}
                    className="!py-3 !normal-case !text-black !h-10 [&.Mui-selected]:!bg-[rgba(0,105,168,0.2)] [&.Mui-selected]:!text-[#0069A8] [&.Mui-selected]:!border-[#0069A8] [&.Mui-selected:hover]:!bg-[rgba(0,105,168,0.4)]"
                  >
                    <Typography
                      fontFamily="Poppins, sans-serif"
                      fontSize={16}
                      fontWeight={500}
                      lineHeight={1}
                    >
                      {option}
                    </Typography>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </div>
          </Tooltip>
        </div>
      )}

      <MobileStepper
        variant="text"
        steps={2}
        position="static"
        activeStep={activeStep}
        className="px-10"
        nextButton={
          <Tooltip title={isGuest ? "Log in to edit preferences" : ""} arrow>
            <span>
              {activeStep === 1 ? (
                <Button
                  size="small"
                  variant="contained"
                  disabled={isSubmitting || isGuest}
                  onClick={handleSubmit}
                  className="!h-[45px] !w-20 !bg-[#0069A8] hover:!brightness-90"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleNext}
                  disabled={isSubmitting || isGuest}
                  className="!h-[45px] !w-20 !bg-[#0069A8] hover:!brightness-90"
                >
                  Next
                  <KeyboardArrowRight />
                </Button>
              )}
            </span>
          </Tooltip>
        }
        backButton={
          <Button
            variant="contained"
            size="small"
            onClick={handleBack}
            disabled={activeStep === 0 || isSubmitting}
            className="!h-[45px] !w-20 !bg-[#0069A8] hover:!brightness-90"
          >
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
    </div>
  );
}
