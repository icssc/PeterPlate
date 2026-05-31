const NATIVE_IOS_COOKIE = "app-platform=iOS App Store";

export function isNativeIosApp(): boolean {
  if (
    typeof navigator !== "undefined" &&
    navigator.userAgent.includes("PWAShell")
  ) {
    return true;
  }

  if (
    typeof document !== "undefined" &&
    document.cookie.includes(NATIVE_IOS_COOKIE)
  ) {
    return true;
  }

  return false;
}

/**
 * OAuth redirect URI for sign-in from the native iOS wrapper (AASA-listed Universal Link).
 */
export function getNativeIosRedirectUri(baseUrl: string) {
  return `${baseUrl}/auth/native`;
}
