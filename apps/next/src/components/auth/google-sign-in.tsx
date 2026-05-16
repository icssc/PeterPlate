"use client";

import { useCallback } from "react";
import { authClient } from "@/utils/auth-client";
import { Button } from "../ui/shadcn/button";

function isNativeIosApp(): boolean {
  if (typeof navigator !== "undefined" && navigator.userAgent.includes("PWAShell")) {
    // WKWebView shell sets this in `apps/pwa/src/PeterPlate/WebView.swift`. Prefer it over
    // `document.cookie`: cookies injected via WKHTTPCookieStore often are not visible to JS,
    // so the old check could miss the shell and route OAuth through `icssc` instead of
    // `icssc-native` — breaking ASWebAuthenticationSession + `/auth/native` flow.
    return true;
  }
  if (typeof document !== "undefined" && document.cookie.includes("app-platform=iOS")) {
    return true;
  }
  return false;
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
