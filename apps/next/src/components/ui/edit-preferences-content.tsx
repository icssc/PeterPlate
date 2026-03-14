"use client";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  CircularProgress,
  IconButton,
  Input,
  ToggleButton,
  Tooltip,
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
  /** Called when the Food Allergies step has one or more custom allergies */
  onExpandChange?: (expanded: boolean) => void;
};

export default function EditPreferencesContent({
  onSaved,
  onExpandChange,
}: EditPreferencesContentProps) {
  const { data: session } = useSession();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMounted = useRef(true);

  const [formData, setFormData] = useState({
    allergies: [] as string[],
    preferences: [] as string[],
  });
  const [customAllergies, setCustomAllergies] = useState<string[]>([]);
  const [customAllergyInput, setCustomAllergyInput] = useState("");

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
    if (existingAllergies !== undefined || existingPreferences !== undefined) {
      const allergies = existingAllergies ?? [];
      const knownAllergies = allergies.filter((a) =>
        (AllergenKeys as readonly string[]).includes(a),
      );
      const custom = allergies.filter(
        (a) => !(AllergenKeys as readonly string[]).includes(a),
      );
      setFormData((prev) => ({
        ...prev,
        allergies:
          existingAllergies !== undefined ? knownAllergies : prev.allergies,
        preferences: existingPreferences ?? prev.preferences,
      }));
      if (existingAllergies !== undefined) {
        setCustomAllergies(custom);
        onExpandChange?.(custom.length > 0);
      }
    }
  }, [existingAllergies, existingPreferences, onExpandChange]);

  useEffect(() => {
    onExpandChange?.(customAllergies.length > 0);
  }, [customAllergies.length, onExpandChange]);

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

  const trimmedCustomInput = customAllergyInput.trim();
  const isAddCustomDisabled = !trimmedCustomInput || isGuest;

  const handleAddCustomAllergy = () => {
    if (isAddCustomDisabled) return;
    const value = trimmedCustomInput;
    setCustomAllergies((prev) =>
      prev.includes(value) ? prev : [...prev, value],
    );
    setCustomAllergyInput("");
  };

  const handleRemoveCustomAllergy = (index: number) => {
    setCustomAllergies((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!session?.user?.id || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const userId = session.user.id;

      const allAllergies = [...formData.allergies, ...customAllergies];
      const allergiesToDelete =
        existingAllergies?.filter((x) => !allAllergies.includes(x)) ?? [];

      await Promise.all([
        ...allergiesToDelete.map((allergy) =>
          deleteAllergy.mutateAsync({ userId, allergy }),
        ),
        addAllergies.mutateAsync({ userId, allergies: allAllergies }),
      ]);

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
      <div className="flex h-64 w-full items-center justify-center bg-white dark:bg-[#313136]">
        <CircularProgress />
      </div>
    );
  }

  const optionButtonBase =
    "font-poppins text-[14px] font-medium leading-[21px] text-center !rounded-[8px] border-2 transition-all duration-200 !normal-case !box-border overflow-visible";
  const optionButtonUnselected =
    "!border-[#D1D5DC] !bg-white !text-black hover:!bg-gray-50 dark:!border-[1px] dark:!border-[#D4D4D8] dark:!bg-[rgba(63,63,71,0.40)] dark:!text-white dark:hover:!bg-[rgba(63,63,71,0.5)]";

  const sectionHeading =
    "font-poppins text-[24px] font-bold leading-[36px] text-[#0069A8] dark:text-[#8EC5FF]";
  const sectionDescription =
    "font-poppins text-[14px] font-normal leading-[21px] text-[#6A7282] dark:text-white";

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col bg-white dark:bg-[#313136] pb-[22px]">
      <div className="w-full shrink-0 rounded-t-[12px] flex flex-row items-center gap-3 pl-[18px] pr-4 pt-4 pb-4 md:flex-col md:items-center md:gap-0 md:pt-4 md:pb-0 md:pl-0 md:pr-0 md:h-[122px] bg-white dark:bg-[#313136] md:bg-[#0069A8] md:dark:border-b-[3px] md:dark:border-b-[#3F3F47]">
        <div
          className="flex !h-10 !w-10 flex-shrink-0 items-center justify-center rounded-full !p-2 bg-[rgba(0,105,168,0.12)] dark:bg-[rgba(142,197,255,0.12)] md:bg-white/20 md:dark:bg-white/10"
          aria-hidden
        >
          <EditIcon
            className="!h-6 !w-6 flex-shrink-0 text-[#0069A8] dark:text-[#8EC5FF] md:!text-white"
            style={{ width: 24, height: 24 }}
          />
        </div>
        <div className="flex flex-col items-start justify-center gap-0 min-w-0 md:items-center">
          <p className="font-poppins text-[16px] font-bold leading-[42px] text-[#0069A8] dark:text-[#8EC5FF] md:text-white -mt-1">
            Update dietary preferences
          </p>
          <p className="font-poppins text-[14px] font-normal leading-[21px] text-[#6A7282] dark:text-white md:text-white -mt-2">
            Make changes to your current needs
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 px-[18px] pt-2 pb-[29.5px] overflow-y-auto">
        {activeStep === 0 ? (
          <>
            <h2 className={sectionHeading}>Food Allergies</h2>
            <p className={`${sectionDescription} mt-1 mb-4`}>
              Help us keep you safe by selecting your food allergies (optional)
            </p>
            <Tooltip title={isGuest ? "Log in to edit preferences" : ""} arrow>
              <div className="grid grid-cols-2 md:grid-cols-3 md:grid-rows-3 gap-[7px] w-full max-w-[464px] md:h-[161px] min-w-0">
                {AllergenKeys.map((opt) => {
                  const selected = formData.allergies.includes(opt);
                  return (
                    <ToggleButton
                      key={opt}
                      value={opt}
                      selected={selected}
                      disabled={isGuest}
                      onClick={() => {
                        const next = selected
                          ? formData.allergies.filter((x) => x !== opt)
                          : [...formData.allergies, opt];
                        handleToggle("allergies", next);
                      }}
                      className={`${optionButtonBase} ${optionButtonUnselected} [&.Mui-selected]:!border-[#0069A8] [&.Mui-selected]:!bg-[rgba(0,105,168,0.20)] [&.Mui-selected]:!text-[#0069A8] [&.Mui-selected]:!rounded-[8px] dark:[&.Mui-selected]:!border-[1px] dark:[&.Mui-selected]:!border-[#8EC5FF] dark:[&.Mui-selected]:!bg-[rgba(142,197,255,0.20)] dark:[&.Mui-selected]:!text-[#8EC5FF] !h-[49px] !w-full !min-w-0 !flex !items-center !justify-center !gap-2`}
                    >
                      <span className="truncate">{opt}</span>
                      {selected ? (
                        <CheckIcon
                          className="flex-shrink-0 text-[#0069A8] dark:text-[#8EC5FF]"
                          style={{ width: 20, height: 20 }}
                        />
                      ) : null}
                    </ToggleButton>
                  );
                })}
              </div>
            </Tooltip>

            {/* Custom allergy input row */}
            <div className="mt-4 flex h-10 items-start gap-2 self-stretch">
              <Input
                disableUnderline
                value={customAllergyInput}
                onChange={(e) => setCustomAllergyInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomAllergy();
                  }
                }}
                disabled={isGuest}
                placeholder="Add custom allergy..."
                className="font-poppins text-[13px] font-normal flex-1 min-w-0 h-10 rounded-lg border-2 border-[#D1D5DC] dark:border-[#D4D4D8] bg-white dark:bg-[rgba(63,63,71,0.40)] px-3 py-2 text-black dark:text-white placeholder:!text-black/50 dark:placeholder:!text-white/50 [&_input]:py-0 [&_input]:h-full [&::before]:!hidden [&::after]:!hidden hover:!border-[#D1D5DC] hover:!border-2 focus-within:!border-[#D1D5DC] focus-within:!border-2 dark:hover:!border-[#D4D4D8] dark:focus-within:!border-[#D4D4D8] !shadow-none"
                inputProps={{
                  "aria-label": "Add custom allergy",
                  className:
                    "placeholder:!text-black/50 dark:placeholder:!text-white/50",
                }}
              />
              <Button
                variant="contained"
                size="small"
                disabled={isAddCustomDisabled}
                onClick={handleAddCustomAllergy}
                className={
                  isAddCustomDisabled
                    ? "!min-w-[63px] !w-[63px] !h-10 !rounded-md !py-2 !px-[22px] font-poppins !text-[15px] !font-medium !leading-[26px] tracking-[0.46px] !text-white !bg-[#99A1AF] !shadow-[0_1px_5px_0_rgba(0,0,0,0.12),0_2px_2px_0_rgba(0,0,0,0.14),0_3px_1px_-2px_rgba(0,0,0,0.2)]"
                    : "!min-w-[63px] !w-[63px] !h-10 !rounded-md !py-2 !px-[22px] font-poppins !text-[15px] !font-medium !leading-[26px] tracking-[0.46px] !text-white !bg-[#0069A8] !shadow-[0_1px_5px_0_rgba(0,0,0,0.12),0_2px_2px_0_rgba(0,0,0,0.14),0_3px_1px_-2px_rgba(0,0,0,0.2)] hover:!bg-[#005a94] dark:!border-2 dark:!border-[#51A2FF] dark:!bg-[#8EC5FF] dark:!text-black dark:hover:!bg-[#7ab8f0]"
                }
              >
                Add
              </Button>
            </div>

            {/* Custom allergies list */}
            {customAllergies.length > 0 && (
              <div className="mt-[7.5px] flex w-full max-w-[346px] flex-col items-start gap-2">
                <div className="flex items-center self-stretch">
                  <span className="font-poppins text-[13px] font-normal leading-[19.5px] tracking-[-0.076px] text-[#6A7282] dark:text-gray-400">
                    Custom Allergies:
                  </span>
                </div>
                <div className="flex flex-wrap gap-[9px]">
                  {customAllergies.map((allergy) => (
                    <span
                      key={allergy}
                      className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#0069A8] px-2.5 py-1 font-poppins text-[13px] font-medium leading-[22px] tracking-[0.46px] text-white shadow-[0_1px_5px_0_rgba(0,0,0,0.12),0_2px_2px_0_rgba(0,0,0,0.14),0_3px_1px_-2px_rgba(0,0,0,0.2)] dark:bg-[#8EC5FF] dark:text-black"
                    >
                      {allergy}
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleRemoveCustomAllergy(
                            customAllergies.indexOf(allergy),
                          )
                        }
                        className="!p-0 !min-w-0 !w-[10.5px] !h-[10.5px]"
                        aria-label={`Remove ${allergy}`}
                      >
                        <CloseIcon
                          className="text-white dark:text-black"
                          style={{ width: 10.5, height: 10.5, fontSize: 10.5 }}
                        />
                      </IconButton>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className={sectionHeading}>Dietary Preferences</h2>
            <p className={`${sectionDescription} mt-1 mb-4`}>
              Select any dietary restrictions that apply to you (optional)
            </p>
            <Tooltip title={isGuest ? "Log in to edit preferences" : ""} arrow>
              <div className="grid grid-cols-2 md:grid-cols-3 md:grid-rows-3 gap-[7px] w-full max-w-[464px] md:h-[161px] min-w-0">
                {PreferenceKeys.map((opt) => {
                  const selected = formData.preferences.includes(opt);
                  return (
                    <ToggleButton
                      key={opt}
                      value={opt}
                      selected={selected}
                      disabled={isGuest}
                      onClick={() => {
                        const next = selected
                          ? formData.preferences.filter((x) => x !== opt)
                          : [...formData.preferences, opt];
                        handleToggle("preferences", next);
                      }}
                      className={`${optionButtonBase} ${optionButtonUnselected} [&.Mui-selected]:!border-[#0069A8] [&.Mui-selected]:!bg-[rgba(0,105,168,0.20)] [&.Mui-selected]:!text-[#0069A8] [&.Mui-selected]:!rounded-[8px] dark:[&.Mui-selected]:!border-[1px] dark:[&.Mui-selected]:!border-[#8EC5FF] dark:[&.Mui-selected]:!bg-[rgba(142,197,255,0.20)] dark:[&.Mui-selected]:!text-[#8EC5FF] !min-h-[49px] !w-full !min-w-0`}
                    >
                      {opt}
                    </ToggleButton>
                  );
                })}
              </div>
            </Tooltip>
          </>
        )}
      </div>

      <footer className="shrink-0 w-full px-[18px] grid grid-cols-2 gap-[7px] h-[49px] md:mx-auto md:w-[464px] md:px-0 md:flex md:justify-between md:items-center md:gap-0 bg-white dark:bg-[#313136] rounded-b-[12px]">
        {activeStep === 0 ? (
          <Button
            variant="outlined"
            size="small"
            disabled={!!isSubmitting}
            onClick={handleNext}
            className="font-poppins text-[14px] font-medium leading-[26px] tracking-[0.46px] !flex !items-center !justify-center !rounded-[8px] !h-[49px] !w-full !min-w-0 md:!w-[81.4px] !border-2 !border-[#D1D5DC] !bg-white !text-black hover:!bg-gray-50 dark:!border-2 dark:!border-[#8EC5FF] dark:!bg-transparent dark:!text-white dark:hover:!bg-[rgba(142,197,255,0.08)] dark:!shadow-[0_1px_8px_0_rgba(0,0,0,0.12),0_3px_4px_0_rgba(0,0,0,0.14),0_3px_3px_-2px_rgba(0,0,0,0.2)]"
          >
            Skip
          </Button>
        ) : (
          <Button
            variant="outlined"
            size="small"
            disabled={!!isSubmitting}
            onClick={handleBack}
            className="font-poppins text-[14px] font-medium leading-[26px] tracking-[0.46px] !flex !items-center !justify-center !rounded-[8px] !h-[49px] !w-full !min-w-0 md:!w-[81.4px] !border-2 !border-[#D1D5DC] !bg-white !text-black hover:!bg-gray-50 dark:!border-2 dark:!border-[#8EC5FF] dark:!bg-transparent dark:!text-white dark:hover:!bg-[rgba(142,197,255,0.08)] dark:!shadow-[0_1px_8px_0_rgba(0,0,0,0.12),0_3px_4px_0_rgba(0,0,0,0.14),0_3px_3px_-2px_rgba(0,0,0,0.2)]"
          >
            Back
          </Button>
        )}
        <Button
          variant="contained"
          size="small"
          disabled={isSubmitting || isGuest}
          onClick={activeStep === 1 ? handleSubmit : handleNext}
          className="font-poppins text-[14px] font-medium leading-[21px] !flex !items-center !justify-center !rounded-[8px] !h-[49px] !w-full !min-w-0 md:!w-[81.4px] !bg-[#0069A8] !text-white dark:!border-2 dark:!border-[#51A2FF] dark:!bg-[#8EC5FF] dark:!text-black dark:hover:!bg-[#7ab8f0] dark:hover:!border-[#51A2FF]"
        >
          {activeStep === 1 ? (isSubmitting ? "Saving..." : "Finish") : "Next"}
        </Button>
      </footer>
    </div>
  );
}
