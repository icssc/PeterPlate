import { appRouter, createTRPCContext } from "@peterplate/api";
import type { AnyRouter } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter as unknown as AnyRouter,
    createContext: () =>
      createTRPCContext({
        headers: req.headers,
        connectionString,
      }),
  });
};

export { handler as GET, handler as POST };
