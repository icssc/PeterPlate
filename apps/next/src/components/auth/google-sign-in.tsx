"use client";

import { useCallback } from "react";
import { authClient } from "@/utils/auth-client";
import { Button } from "../ui/shadcn/button";

function isNativeIosApp(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("app-platform=iOS");
}

export function GoogleSignInButton() {
  const handleSignIn = useCallback(async () => {
    // In the native iOS shell, use the "icssc-native" provider which sets
    // redirect_uri to /auth/native (an AASA-listed Universal Link path).
    // The WKWebView's decidePolicyFor intercepts auth.icssc.club/authorize
    // and hands it off to ASWebAuthenticationSession.
    //
    // In the browser, use the standard "icssc" provider with the default
    // redirect_uri so Safari OAuth flows aren't hijacked via Universal Links.
    const providerId = isNativeIosApp() ? "icssc-native" : "icssc";

    try {
      await authClient.signIn.oauth2({
        providerId,
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
