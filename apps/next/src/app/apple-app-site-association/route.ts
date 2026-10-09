import { NextResponse } from "next/server";

/**
 * Apple App Site Association (AASA) for peterplate.com.
 *
 * `webcredentials` lets ASWebAuthenticationSession accept HTTPS OAuth callbacks
 * on this domain (Better Auth: `/api/auth/oauth2/callback/icssc`). The callback
 * path is not listed under `applinks` so mobile Safari logins stay in Safari.
 *
 * @see apps/ios/src/PeterPlate/ViewController.swift
 */

const TEAM_ID = "66682RDDDK";

const BUNDLE_IDS: readonly string[] = ["com.peterplate"];

const appIDs = BUNDLE_IDS.map((bundleId) => `${TEAM_ID}.${bundleId}`);

const aasa = {
  webcredentials: {
    apps: appIDs,
  },
} as const;

export function GET() {
  if (TEAM_ID.length === 0 || appIDs.length === 0) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.json(aasa, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
    },
  });
}
