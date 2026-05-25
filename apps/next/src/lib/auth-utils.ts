import { Provider } from "@/lib/auth-types";

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

export function getProviderDisplayName(provider: Provider): string {
  switch (provider) {
    case Provider.Google:
      return "Google";
    case Provider.Apple:
      return "Apple";
  }
}

export function getProviderIcsscName(provider: Provider): string {
  switch (provider) {
    case Provider.Google:
      return "google";
    case Provider.Apple:
      return "apple";
  }
}
