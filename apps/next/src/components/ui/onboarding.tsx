import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  Drawer,
  MobileStepper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  AllergenKeys,
  PreferenceKeys,
} from "../../../../../packages/validators/src/adobe-ecommerce";
import { GoogleSignInButton } from "../auth/google-sign-in";

interface PersonalizeViewProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  options: readonly string[];
  selected: string[];
  onSelection: (newValues: string[]) => void;
}

interface OnboardingContentProps extends React.HTMLAttributes<HTMLDivElement> {
  handleClose: () => void;
}

const WelcomeView = React.forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <Box
      ref={ref}
      sx={{
        paddingX: "40px",
        paddingTop: "30px",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
      >
        <Avatar
          src="/peterplate-icon.webp"
          alt="PeterPlate Icon"
          sx={{
            width: "120px",
            height: "120px",
          }}
        />
        <Typography variant="h4" color="primary" fontWeight={700}>
          PeterPlate
        </Typography>
        <Typography color="gray" fontWeight={500} fontSize={18} pt="10px">
          Your UCI dining companion
        </Typography>
        <Typography variant="h5" color="black" fontWeight={700} pt="20px">
          Welcome!
        </Typography>
        <Typography
          color="gray"
          fontWeight={500}
          fontSize={16}
          pt="10px"
          pb="20px"
        >
          Sign in with your UCI Google account to access dining hall menus; rate
          and favorite dishes; and personalize your dining experience.
        </Typography>
        <GoogleSignInButton />
        <Typography color="gray" fontWeight={500} fontSize={15} py="10px">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Typography>
      </Box>
    </Box>
  );
});
WelcomeView.displayName = "WelcomeView";

const PersonalizeView = React.forwardRef<HTMLDivElement, PersonalizeViewProps>(
  ({ title, description, options, selected, onSelection }, ref) => {
    return (
      <Box ref={ref}>
        <Box>
          <Avatar src="/user.webp" alt="User Profile Icon" />
          <Typography>Welcome USER</Typography>
          <Typography>Let's personalize your dining experience</Typography>
        </Box>

        <Box>
          <Typography>{title}</Typography>
          <Typography>{description}</Typography>
        </Box>

        <ToggleButtonGroup
          value={selected}
          onChange={(_, newValues) => onSelection(newValues)}
          aria-label="select"
          exclusive={false}
          fullWidth
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1.5,
            "& .MuiToggleButtonGroup-grouped": {
              border: "1px solid !important",
              borderRadius: "12px !important",
              borderColor: "divider",
            },
          }}
        >
          {options.map((opt) => (
            <ToggleButton
              key={opt}
              value={opt}
              sx={{
                py: 3,
                textTransform: "none",
                "&.Mui-selected": {
                  backgroundColor: "primary.light",
                  color: "primary.main",
                  borderColor: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.light",
                  },
                },
              }}
            >
              {opt}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
    );
  },
);
PersonalizeView.displayName = "PersonalizeView";

const OnboardingContent = React.forwardRef<
  HTMLDivElement,
  OnboardingContentProps
>(({ handleClose }, ref) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    allergies: [] as string[],
    preferences: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = (key: keyof typeof formData, newValues: string[]) => {
    setFormData((prev) => ({
      ...prev,
      [key]: newValues,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // call TRPC procedure
      handleClose();
    } catch (error) {
      console.error("Onboarding failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box ref={ref} width="100%">
      {activeStep === 0 && <WelcomeView />}
      {activeStep === 1 && (
        <PersonalizeView
          title="Food Allergies"
          description="Help us keep you safe by selecting your food allergies (optional)"
          options={AllergenKeys}
          selected={formData.allergies}
          onSelection={(vals) => handleToggle("allergies", vals)}
        />
      )}
      {activeStep === 2 && (
        <PersonalizeView
          title="Dietary Preferences"
          description="Select any dietary restrictions that apply to you (optional)"
          options={PreferenceKeys}
          selected={formData.preferences}
          onSelection={(vals) => handleToggle("allergies", vals)}
        />
      )}

      <MobileStepper
        variant="text"
        steps={3}
        position="static"
        activeStep={activeStep}
        nextButton={
          activeStep === 2 ? (
            <Button
              size="small"
              variant="contained"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Saving..." : "Finish"}
            </Button>
          ) : (
            <Button size="small" onClick={handleNext}>
              Next
              <KeyboardArrowRight />
            </Button>
          )
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
    </Box>
  );
});

export default function OnboardingDialog(): React.JSX.Element {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(true);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (isDesktop)
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={false}
        slotProps={{
          paper: {
            sx: {
              width: "460px",
              maxWidth: "90vw",
              margin: 2,
              padding: 0,
              overflow: "hidden",
              borderRadius: "16px",
            },
          },
        }}
      >
        <OnboardingContent handleClose={handleClose} />
      </Dialog>
    );
  else
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              padding: 0,
              overflow: "hidden",
              borderRadius: "16px",
            },
          },
        }}
        sx={{
          "& .MuiDrawer-paper": {
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            marginTop: "96px",
            height: "auto",
          },
        }}
      >
        <OnboardingContent handleClose={handleClose} />
      </Drawer>
    );
}
