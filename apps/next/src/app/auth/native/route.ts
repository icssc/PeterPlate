import { auth } from "@peterplate/api/auth";

/**
 * iOS native OAuth callback sink.
 *
 * Only used when the web app detects it's running inside the native iOS
 * shell (via the `app-platform` cookie) and initiates OAuth with the
 * `icssc-native` provider, which sets `redirectURI` to this path.
 * Browser users use the standard `icssc` provider and never hit this route.
 *
 * The iOS wrapper's ASWebAuthenticationSession uses this path as its HTTPS
 * callback (listed in AASA). When auth.icssc.club completes the OAuth flow,
 * it redirects here; ASW captures the redirect, and the Swift code loads
 * this URL in the WKWebView.
 *
 * This handler forwards the request to Better Auth's internal handler by
 * rewriting the path to /api/auth/callback/icssc-native.
 */
export async function GET(req: Request) {
    const url = new URL(req.url);
    url.pathname = "/api/auth/callback/icssc-native";

    const rewritten = new Request(url.toString(), {
        headers: req.headers,
        method: req.method,
    });

    return auth.handler(rewritten);
}
