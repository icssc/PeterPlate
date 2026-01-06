import type { AnyRouter } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter, createTRPCContext } from "@zotmeal/api";

const handler = (req: Request) => {
  if (!process.env.DATABASE_URL)
    console.error(
      "Database URL is not configured. Please configure and try again.",
    );

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter as unknown as AnyRouter,
    createContext: () =>
      createTRPCContext({
        headers: req.headers,
        connectionString: process.env.DATABASE_URL ?? "",
      }),
  });
};

export { handler as GET, handler as POST };
