"use client";

import { AppleSignInButton } from "./apple-sign-in";
import { GoogleSignInButton } from "./google-sign-in";

interface SignInButtonsProps {
  fullWidth?: boolean;
}

export function SignInButtons({ fullWidth = true }: SignInButtonsProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <GoogleSignInButton fullWidth={fullWidth} />
      <AppleSignInButton fullWidth={fullWidth} />
    </div>
  );
}
