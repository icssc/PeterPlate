"use client";

import { Apple } from "@mui/icons-material";
import { Box, Dialog, Typography } from "@mui/material";
import { SignInButton } from "@/components/auth/sign-in-button";
import { Provider } from "@/lib/auth-types";

const GoogleLogo = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginDialog({ open, onClose }: LoginDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow:
            "0px 3px 7px rgba(0,0,0,0.12), 0px 8px 5px rgba(0,0,0,0.14), 0px 5px 2.5px rgba(0,0,0,0.2)",
        },
      }}
    >
      <Box
        className="dark:bg-[var(--surface-modal)]"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 5,
          alignItems: "center",
          padding: "58px 48px",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            alignItems: "center",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            fontWeight={700}
            color="primary"
            sx={{
              fontSize: "3.625rem",
              letterSpacing: "-4px",
              lineHeight: 1,
            }}
          >
            PeterPlate
          </Typography>
          <Typography
            variant="subtitle2"
            fontWeight={500}
            color="primary"
            sx={{ fontSize: "0.875rem" }}
          >
            Your UCI dining companion
          </Typography>
        </Box>

        {/* Welcome Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            fontWeight={700}
            sx={{ fontSize: "1.5rem", color: "text.primary" }}
          >
            Welcome!
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: "center",
              fontSize: "0.875rem",
            }}
          >
            Sign in with your Google or Apple account to personalize your dining
            experience.
          </Typography>
        </Box>

        {/* Sign In Buttons */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {/* Google Button */}
          <SignInButton
            icon={<GoogleLogo />}
            provider={Provider.Google}
            fullWidth={true}
            className={`border-2 border-primary-accent text-primary bg-white 
              hover:bg-gray-50 dark:bg-primary-accent dark:text-black dark:border-0`}
          />

          {/* Or Divider */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              width: "100%",
            }}
          >
            <Box
              sx={{
                flex: 1,
                height: "1px",
                backgroundColor: "hsl(var(--border))",
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.875rem" }}
            >
              or
            </Typography>
            <Box
              sx={{
                flex: 1,
                height: "1px",
                backgroundColor: "hsl(var(--border))",
              }}
            />
          </Box>

          {/* Apple Button */}
          <SignInButton
            icon={<Apple />}
            provider={Provider.Apple}
            fullWidth={true}
            className={`border-0 shadow bg-black text-white dark:bg-white 
              dark:text-black`}
          />
        </Box>
      </Box>
    </Dialog>
  );
}
