"use client";

import { useCallback, useState } from "react";
import { getSignInUrl } from "@/lib/auth-actions";
import { isNativeIosApp } from "@/lib/platform";
import { Button } from "../ui/shadcn/button";

export function GoogleSignInButton() {
  const [signInError, setSignInError] = useState<string | null>(null);

  const handleSignIn = useCallback(async () => {
    setSignInError(null);

    try {
      const authUrl = await getSignInUrl(isNativeIosApp());
      window.location.href = authUrl;
    } catch (error) {
      console.error("Sign in error:", error);
      const message =
        error instanceof Error ? error.message : "Sign-in request failed.";
      setSignInError(message);
    }
  }, []);

  return (
    <div className="flex w-full flex-col gap-2">
      <Button onClick={handleSignIn} className="w-full">
        Sign In with Google
      </Button>
      {signInError ? (
        <p className="text-center text-sm text-destructive" role="alert">
          {signInError}
        </p>
      ) : null}
    </div>
  );
}
