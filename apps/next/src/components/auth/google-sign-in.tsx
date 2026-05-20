"use client";

import posthog from "posthog-js";
import { useCallback, useState } from "react";
import { authClient } from "@/utils/auth-client";
import { Button } from "../ui/shadcn/button";

function isNativeIosApp(): boolean {
  if (
    typeof navigator !== "undefined" &&
    navigator.userAgent.includes("PWAShell")
  ) {
    // WKWebView shell sets this in `apps/pwa/src/PeterPlate/WebView.swift`. Prefer it over
    // `document.cookie`: cookies injected via WKHTTPCookieStore often are not visible to JS,
    // so the old check could miss the shell and route OAuth through `icssc` instead of
    // `icssc-native` — breaking ASWebAuthenticationSession + `/auth/native` flow.
    return true;
  }
  if (
    typeof document !== "undefined" &&
    document.cookie.includes("app-platform=iOS")
  ) {
    return true;
  }
  return false;
}

export function GoogleSignInButton() {
  const [signInError, setSignInError] = useState<string | null>(null);

  const handleSignIn = useCallback(async () => {
    posthog.capture("sign_in_clicked", { provider: "google" });
    setSignInError(null);
    // In the native iOS shell, use the "icssc-native" provider which sets
    // redirect_uri to /auth/native (an AASA-listed Universal Link path).
    // The WKWebView's decidePolicyFor intercepts auth.icssc.club/authorize
    // and hands it off to ASWebAuthenticationSession.
    //
    // In the browser, use the standard "icssc" provider with the default
    // redirect_uri so Safari OAuth flows aren't hijacked via Universal Links.
    const providerId = isNativeIosApp() ? "icssc-native" : "icssc";

    try {
      // authClient methods resolve with { data, error } — they do NOT throw on
      // server errors (4xx/5xx). If we only `await` without checking the return
      // value, a server-side failure silently swallows the error: the
      // redirectPlugin.onSuccess hook never fires, window.location.href is
      // never set, decidePolicyFor never fires, and the auth sheet never appears.
      const { error } = await authClient.signIn.oauth2({
        providerId,
        callbackURL: "/",
      });
      if (error) throw new Error(error.message ?? "Sign-in request failed.");
    } catch (error) {
      console.error("Sign in error:", error);
      posthog.captureException(error);
      const message =
        error instanceof Error ? error.message : "Sign-in request failed.";
      setSignInError(message);
    }
  }, []);

  return (
    <div className="flex w-full flex-col gap-2">
      <Button
        onClick={handleSignIn}
        className="w-full bg-sky-700 text-white hover:bg-sky-800 dark:bg-blue-300 dark:text-gray-900 dark:hover:bg-blue-400"
      >
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
