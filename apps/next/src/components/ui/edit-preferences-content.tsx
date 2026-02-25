"use client";

import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import {
  Avatar,
  Button,
  MobileStepper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useSession } from "@/utils/auth-client";
import { trpc } from "@/utils/trpc";
import {
  AllergenKeys,
  PreferenceKeys,
} from "../../../../../packages/validators/src/adobe-ecommerce";

export default function EditPreferencesContent() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] || "User";
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    allergies: [] as string[],
    preferences: [] as string[],
  });

  const addAllergies = trpc.allergy.addAllergies.useMutation();
  const addPreferences = trpc.preference.addDietaryPreferences.useMutation();

  const handleToggle = (key: keyof typeof formData, newValues: string[]) => {
    setFormData((prev) => ({
      ...prev,
      [key]: newValues,
    }));
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      console.error("Please login first.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addAllergies.mutateAsync({
        userId: session.user.id,
        allergies: formData.allergies,
      });
      await addPreferences.mutateAsync({
        userId: session.user.id,
        preferences: formData.preferences,
      });
    } catch (error) {
      console.error("Saving preferences failed:", error);
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
              Update your dining profile
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
              className="pt-4"
            >
              Help us keep you safe by selecting your food allergies (optional)
            </Typography>
          </div>

          <ToggleButtonGroup
            value={formData.allergies}
            onChange={(_, newValues) => handleToggle("allergies", newValues)}
            aria-label="select allergies"
            exclusive={false}
            fullWidth
            className="pt-2 px-10 grid grid-cols-2 sm:grid-cols-3 gap-2 [&_.MuiToggleButtonGroup-grouped]:!border-2 [&_.MuiToggleButtonGroup-grouped]:!rounded-[10px] [&_.MuiToggleButtonGroup-grouped]:!border-gray-400"
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
              Update your dining profile
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

          <ToggleButtonGroup
            value={formData.preferences}
            onChange={(_, newValues) => handleToggle("preferences", newValues)}
            aria-label="select preferences"
            exclusive={false}
            fullWidth
            className="pt-2 px-10 grid grid-cols-2 sm:grid-cols-3 gap-2 [&_.MuiToggleButtonGroup-grouped]:!border-2 [&_.MuiToggleButtonGroup-grouped]:!rounded-[10px] [&_.MuiToggleButtonGroup-grouped]:!border-gray-400"
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
      )}

      <MobileStepper
        variant="text"
        steps={2}
        position="static"
        activeStep={activeStep}
        className="px-10"
        nextButton={
          activeStep === 1 ? (
            <Button
              size="small"
              variant="contained"
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              className="!h-[45px] !w-20 !bg-[#0069A8] hover:!brightness-90"
            >
              Next
              <KeyboardArrowRight />
            </Button>
          )
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
