export function getSafeAuthRedirectPath(
  redirectUrl: string | null | undefined,
  requestUrl: string | null | undefined,
  allowedOrigin: string,
): string {
  if (!redirectUrl) {
    return "/";
  }

  try {
    const requestOrigin = requestUrl
      ? new URL(requestUrl).origin
      : allowedOrigin;
    const url = new URL(redirectUrl, requestOrigin);
    if (url.origin === allowedOrigin) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
    return "/";
  } catch {
    return "/";
  }
}
