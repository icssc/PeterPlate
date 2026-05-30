const NATIVE_IOS_COOKIE = "app-platform=iOS App Store";

export function isNativeIosApp(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  return document.cookie.includes(NATIVE_IOS_COOKIE);
}

/**
 * OAuth redirect URI for sign-in from the native iOS wrapper (AASA-listed Universal Link).
 */
export function getNativeIosRedirectUri(baseUrl: string) {
  return `${baseUrl}/auth/native`;
}
