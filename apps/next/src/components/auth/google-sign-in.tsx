"use client";

import { useCallback } from "react";
import { authClient } from "@/utils/auth-client";
import { Button } from "../ui/shadcn/button";

export function GoogleSignInButton() {
  const handleSignIn = useCallback(async () => {
    try {
      await authClient.signIn.oauth2({
        providerId: "icssc",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Sign in error:", error);
    }
  }, []);

  return (
    <Button onClick={handleSignIn} className="w-full">
      Sign In with Google
    </Button>
  );
}
