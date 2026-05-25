"use server";

import { auth } from "@/lib/auth";
import { Provider } from "@/lib/auth-types";
import { getProviderIcsscName } from "@/lib/auth-utils";
import { getNativeIosRedirectUri } from "@/lib/platform";

const OIDC_ISSUER_URL = "https://auth.icssc.club";

export async function getSignInUrl(
  provider: Provider,
  isNativeIosApp: boolean,
  returnUrl?: string,
) {
  const baseURL =
    process.env.NEXT_PUBLIC_BASE_URL ??
    process.env.BETTER_AUTH_URL ??
    "https://peterplate.com";

  const { url } = await auth.api.signInWithOAuth2({
    body: {
      providerId: "icssc",
      callbackURL: isNativeIosApp ? getNativeIosRedirectUri(baseURL) : "/",
      additionalData: {
        returnUrl,
        provider,
      },
    },
  });

  const authUrl = new URL(url);
  authUrl.searchParams.set("provider", getProviderIcsscName(provider));
  return authUrl.toString();
}

export async function getSignOutUrl(redirectUrl: string) {
  const oidcLogoutUrl = new URL(`${OIDC_ISSUER_URL}/logout`);
  oidcLogoutUrl.searchParams.set("post_logout_redirect_uri", redirectUrl);
  return oidcLogoutUrl.toString();
}
