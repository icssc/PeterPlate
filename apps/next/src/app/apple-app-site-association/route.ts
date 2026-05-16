import { NextResponse } from 'next/server';

/**
 * Apple App Site Association (AASA) file.
 *
 * Served at `https://www.peterplate.com/.well-known/apple-app-site-association`
 * (via a rewrite in `next.config.ts`). Apple's CDN fetches this to:
 *
 * 1. Authorize the PeterPlate iOS app to claim Universal Links for the
 *    `/auth/native` path — the OAuth redirect URI that the iOS wrapper
 *    hands to `ASWebAuthenticationSession` as its HTTPS callback
 *    (see `apps/pwa/src/PeterPlate/ViewController.swift` startAuthSession).
 * 2. Authorize PP for shared web credentials (`webcredentials` entitlement).
 *
 * Both the Team ID and Bundle IDs are public — the AASA file is fetched by
 * Apple's CDN over plain HTTPS. They're hardcoded intentionally.
 *
 * - `TEAM_ID`: 10-char Apple Developer Team ID. Same ICSSC org as AntAlmanac.
 * - `BUNDLE_IDS`: every bundle ID that should resolve Universal Links for
 *   www.peterplate.com.
 *
 */

const TEAM_ID = '66682RDDDK';

const BUNDLE_IDS: readonly string[] = [
    'com.peterplate',
];

const appIDs = BUNDLE_IDS.map((bundleId) => `${TEAM_ID}.${bundleId}`);

const aasa = {
    applinks: {
        details: [
            {
                appIDs,
                components: [
                    {
                        '/': '/auth/native',
                        comment: 'PeterPlate iOS OAuth callback (ASWebAuthenticationSession)',
                    },
                ],
            },
        ],
    },
    webcredentials: {
        apps: appIDs,
    },
} as const;

export function GET() {
    if (TEAM_ID.length === 0 || appIDs.length === 0) {
        return new NextResponse('Not Found', { status: 404 });
    }

    return NextResponse.json(aasa, {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400',
        },
    });
}
