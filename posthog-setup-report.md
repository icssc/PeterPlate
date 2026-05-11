<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into PeterPlate, a UCI dining hall companion app built with Next.js 16 (App Router). The integration adds client-side event tracking, user identification, error capture, a reverse proxy for reliable ingestion, and server-side PostHog client support.

## Changes made

### New files
| File | Purpose |
|------|---------|
| `apps/next/instrumentation-client.ts` | Client-side PostHog initialization via Next.js 15.3+ instrumentation API |
| `apps/next/src/lib/posthog-server.ts` | Singleton server-side PostHog client for API routes and Server Actions |
| `apps/next/.env.local` | PostHog public token and host environment variables |

### Modified files
| File | Changes |
|------|---------|
| `apps/next/next.config.ts` | Added PostHog reverse proxy rewrites (`/ingest/*`) and `skipTrailingSlashRedirect: true` |
| `apps/next/package.json` | Added `posthog-js` and `posthog-node` dependencies |
| `apps/next/src/app/layout-client.tsx` | User identification (`posthog.identify`) on session load; `posthog.reset()` on sign-out |
| `apps/next/src/components/auth/google-sign-in.tsx` | `sign_in_clicked` event + `captureException` on auth error |
| `apps/next/src/components/ui/onboarding.tsx` | `onboarding_completed` event with allergy/preference counts; error tracking |
| `apps/next/src/components/ui/favorite.tsx` | `dish_favorited` / `dish_unfavorited` events with `dish_id` |
| `apps/next/src/components/ui/interactive-star-rating.tsx` | `dish_rated` event with `dish_id` and `rating` value |
| `apps/next/src/components/ui/meal-search.tsx` | `meal_search_opened` event; `meal_search_result_added` event with dish name/servings |
| `apps/next/src/app/nutrition/page.tsx` | `meal_logged` event with dish name and servings on successful log |
| `apps/next/src/components/ui/edit-preferences-content.tsx` | `preferences_updated` event with allergy/preference counts; error tracking |

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `sign_in_clicked` | User clicks the Google Sign In button | `src/components/auth/google-sign-in.tsx` |
| `onboarding_completed` | User finishes onboarding with allergies and dietary preferences | `src/components/ui/onboarding.tsx` |
| `dish_favorited` | User adds a dish to their favorites | `src/components/ui/favorite.tsx` |
| `dish_unfavorited` | User removes a dish from their favorites | `src/components/ui/favorite.tsx` |
| `dish_rated` | User rates a dish with a star rating | `src/components/ui/interactive-star-rating.tsx` |
| `meal_logged` | User logs a meal in the nutrition tracker | `src/app/nutrition/page.tsx` |
| `meal_search_opened` | User opens the meal search dialog/drawer | `src/components/ui/meal-search.tsx` |
| `meal_search_result_added` | User adds a meal from search results | `src/components/ui/meal-search.tsx` |
| `preferences_updated` | User saves updated dietary preferences and allergies | `src/components/ui/edit-preferences-content.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard** – [Analytics basics](https://us.posthog.com/project/406038/dashboard/1547870)
- **Insight** – [Sign-in to Onboarding Funnel](https://us.posthog.com/project/406038/insights/Dk2hT7ZE)
- **Insight** – [Meal Logging Trend](https://us.posthog.com/project/406038/insights/JUm1og2S)
- **Insight** – [Dish Engagement: Favorites vs Ratings](https://us.posthog.com/project/406038/insights/jNCCZjnp)
- **Insight** – [Meal Search to Meal Logged Funnel](https://us.posthog.com/project/406038/insights/kaWckETm)
- **Insight** – [Preferences Updated by Users](https://us.posthog.com/project/406038/insights/0emh6Zne)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
