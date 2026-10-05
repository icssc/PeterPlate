"use client";

import posthog from "posthog-js";
import { type ReactNode, useCallback, useState } from "react";
import { getSignInUrl } from "@/lib/auth-actions";
import type { Provider } from "@/lib/auth-types";
import { getProviderDisplayName } from "@/lib/auth-utils";
import { cn } from "@/utils/tw";
import { Button } from "../ui/shadcn/button";

interface SignInButtonProps {
  icon: ReactNode;
  provider: Provider;
  fullWidth?: boolean;
  className?: string;
}

export function SignInButton({
  icon,
  provider,
  fullWidth = true,
  className,
}: SignInButtonProps) {
  const [signInError, setSignInError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = useCallback(async () => {
    posthog.capture("sign_in_clicked", { provider });
    setSignInError(null);
    setIsSigningIn(true);

    try {
      const authUrl = await getSignInUrl(provider, {
        returnUrl: `${window.location.pathname}${window.location.search}${window.location.hash}`,
      });
      window.location.href = authUrl;
    } catch (error) {
      console.error("Sign in error:", error);
      posthog.captureException(error);
      const message =
        error instanceof Error ? error.message : "Sign-in request failed.";
      setSignInError(message);
      setIsSigningIn(false);
    }
  }, [provider]);

  return (
    <div className={cn("flex flex-col gap-2", fullWidth && "w-full")}>
      <Button
        onClick={handleSignIn}
        disabled={isSigningIn}
        className={cn(fullWidth && "w-full", className)}
      >
        {icon}
        Sign in with {getProviderDisplayName(provider)}
      </Button>
      {signInError ? (
        <p className="text-center text-sm text-destructive" role="alert">
          {signInError}
        </p>
      ) : null}
    </div>
  );
}
