"use server";

import { auth } from "@/lib/auth";
import { AUTH_PROVIDER_ID } from "@/lib/auth-constants";
import type { AuthAdditionalData, Provider } from "@/lib/auth-types";
import { getProviderIcsscName } from "@/lib/auth-utils";
import { getNativeIosRedirectUri } from "@/lib/platform";

const OIDC_ISSUER_URL = "https://auth.icssc.club";

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL ??
  process.env.BETTER_AUTH_URL ??
  "https://peterplate.com";

interface GetSignInUrlOptions {
  authorizationUrlParams?: Record<string, string>;
  returnUrl?: string;
  isNativeIosApp?: boolean;
}

export async function getSignInUrl(
  provider: Provider,
  {
    authorizationUrlParams,
    returnUrl,
    isNativeIosApp,
  }: GetSignInUrlOptions = {},
) {
  const { url } = await auth.api.signInWithOAuth2({
    body: {
      providerId: AUTH_PROVIDER_ID,
      callbackURL: isNativeIosApp
        ? getNativeIosRedirectUri(baseURL)
        : undefined,
      additionalData: {
        returnUrl,
        provider,
      } satisfies AuthAdditionalData,
    },
  });

  const authUrl = new URL(url);
  for (const [key, val] of Object.entries(authorizationUrlParams ?? {})) {
    authUrl.searchParams.set(key, val);
  }
  authUrl.searchParams.set("provider", getProviderIcsscName(provider));
  return authUrl.toString();
}

export async function getSignOutUrl(redirectUrl: string) {
  const oidcLogoutUrl = new URL(`${OIDC_ISSUER_URL}/logout`);
  const redirectTo = redirectUrl || baseURL;
  oidcLogoutUrl.searchParams.set("post_logout_redirect_uri", redirectTo);
  return oidcLogoutUrl.toString();
}
