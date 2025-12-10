import {
  awsLambdaRequestHandler,
  CreateAWSLambdaContextOptions,
} from "@trpc/server/adapters/aws-lambda";
import type { AnyRouter } from "@trpc/server";
import { APIGatewayProxyEventV2, Context } from "aws-lambda";

import { appRouter, createTRPCContext } from "@zotmeal/api";
import { ssl } from "../ssl";

const createContext = (
  _opts: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>,
) =>
  createTRPCContext({
    headers: new Headers({
      "x-trpc-source": "zotmeal-lambda",
    }),
    connectionString: process.env.DATABASE_URL,
    ssl,
  });

// type Context = Awaited<ReturnType<typeof createContext>>;

const trpcHandler = awsLambdaRequestHandler({
  router: appRouter as unknown as AnyRouter,
  createContext,
});

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
) => {
  // Handle OPTIONS requests for CORS preflight
  if (event.requestContext.http.method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": event.headers.origin || "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "content-type,x-trpc-source",
        "Access-Control-Max-Age": "86400",
      },
      body: "",
    };
  }

  return trpcHandler(event, context);
};

export const main = handler;
