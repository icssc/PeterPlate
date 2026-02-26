import { appRouter, createTRPCContext } from "@peterplate/api";
import type { AnyRouter } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter as unknown as AnyRouter,
    createContext: () =>
      createTRPCContext({
        headers: req.headers,
        connectionString: process.env.DATABASE_URL!,
      }),
  });
};

export { handler as GET, handler as POST };
