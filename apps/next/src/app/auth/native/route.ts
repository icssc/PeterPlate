import { auth } from "@peterplate/api/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

/**
 * iOS OAuth callback (AASA-listed Universal Link). ASWebAuthenticationSession
 * returns here; forward to Better Auth's handler so the session cookie is set
 * in the WKWebView via toNextJsHandler + nextCookies.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  url.pathname = "/api/auth/oauth2/callback/icssc-native";

  return handler.GET(
    new Request(url.toString(), {
      headers: req.headers,
      method: req.method,
    }),
  );
}
