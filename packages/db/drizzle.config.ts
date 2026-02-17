import { join } from "node:path";
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Get current file's directory
config({ path: join(process.cwd(), ".env") });

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

export default defineConfig({
  dialect: "postgresql",
  out: "./migrations",
  schema: [
    "./src/schema/contributors.ts",
    "./src/schema/dietRestrictions.ts",
    "./src/schema/dishes.ts",
    "./src/schema/enums.ts",
    "./src/schema/events.ts",
    "./src/schema/favorites.ts",
    "./src/schema/menus.ts",
    "./src/schema/nutritionInfos.ts",
    "./src/schema/loggedMeals.ts",
    "./src/schema/periods.ts",
    "./src/schema/pushTokens.ts",
    "./src/schema/ratings.ts",
    "./src/schema/restaurants.ts",
    "./src/schema/stations.ts",
    "./src/schema/users.ts",
    "./src/schema/auth-schema.ts",
    "./src/schema/loggedMeals.ts",
    "./src/schema/userAllergies.ts",
    "./src/schema/userDietaryPreferences.ts",
  ],
  dbCredentials: { url: process.env.DATABASE_URL, ssl: false },
  verbose: !process.env.CI,
});
