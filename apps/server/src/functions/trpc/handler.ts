import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

import { appRouter, createTRPCContext } from "@zotmeal/api";

const createContext = (
) =>
  createTRPCContext({
    headers: new Headers({
      "x-trpc-source": "zotmeal-lambda",
    }),
    connectionString: process.env.DATABASE_URL,
  });

  const trpcHandler = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
});

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {

  const path = 
    event.rawPath || 
    event.requestContext?.http?.path || 
    event.pathParameters?.proxy ||
    "";
  
  // Block requests to /api/auth/* or /auth/*
  if (path.includes("/api/auth") || path.includes("/auth")) {
    console.log("Blocked auth route:", path);
    return {
      statusCode: 404,
      body: JSON.stringify({ 
        error: "Not found - auth routes are handled separately" 
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  return trpcHandler(event, {} as any);

};

export const main = handler