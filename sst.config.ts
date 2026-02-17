// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

function getDomain() {
  if ($app.stage === "production") {
    return "peterplate.com";
  } else if ($app.stage.match(/^staging-(\d+)$/)) {
    return `${$app.stage}.peterplate.com`;
  }

  throw new Error("Invalid stage");
}

function getClientId() {
  if ($app.stage === "production" || $app.stage.match(/^staging-(\d+)$/))
    return "peterplate";

  return "peterplate-dev";
}

export default $config({
  app(input) {
    return {
      name: "peterplate",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          region: "us-west-1",
        },
      },
    };
  },
  async run() {
    const domain = getDomain();
    const clientId = getClientId();

    const api = new sst.aws.ApiGatewayV2("Api", {
      cors: {
        allowOrigins: [
          `https://${domain}`,
          `https://www.${domain}`,
          ...(domain === "peterplate.com" ? [] : ["http://localhost:3000"]),
        ],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["content-type", "x-trpc-source"],
        allowCredentials: false,
      },
    });

    api.route("ANY /{proxy+}", {
      handler: "apps/server/src/functions/trpc/handler.main",
      memory: "256 MB",
      environment: {
        DATABASE_URL: process.env.DATABASE_URL!,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
        BETTER_AUTH_URL: `https://${domain}`,
        AUTH_CLIENT_ID: clientId,
        NODE_ENV: process.env.NODE_ENV || "development",
      },
    });

    new sst.aws.Cron("TestLog", {
      schedule: "rate(1 minute)",
      job: {
        handler: "apps/server/src/functions/cron/testLog.main",
        environment: {
          DATABASE_URL: process.env.DATABASE_URL!,
          NODE_ENV: process.env.NODE_ENV || "development",
        },
      },
    });

    const dailyCron = new sst.aws.Cron("Daily", {
      schedule: "cron(0 0 * * ? *)", // Run daily at 00:00 UTC
      job: {
        handler: "apps/server/src/functions/cron/daily.main",
        timeout: "10 minutes",
        environment: {
          DATABASE_URL: process.env.DATABASE_URL!,
          NODE_ENV: process.env.NODE_ENV || "development",
        },
      },
    });

    const weeklyCron = new sst.aws.Cron("Weekly", {
      schedule: "cron(0 0 ? * 1 *)", // Run at 00:00 on Sunday
      job: {
        handler: "apps/server/src/functions/cron/weekly.main",
        timeout: "10 minutes",
        environment: {
          DATABASE_URL: process.env.DATABASE_URL!,
          NODE_ENV: process.env.NODE_ENV || "development",
        },
      },
    });

    const site = new sst.aws.Nextjs("site", {
      path: "apps/next",
      environment: {
        NEXT_PUBLIC_API_URL: api.url,
        DATABASE_URL: process.env.DATABASE_URL!,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
        AUTH_CLIENT_ID: clientId,
        BETTER_AUTH_URL: `https://${domain}`,
      },
      cachePolicy: "50ea56d0-b7b0-4bf7-9ab8-0f7f9a0d03d5",
      domain: {
        name: domain,
        redirects: [`www.${domain}`],
        dns: sst.aws.dns({
          zone: "Z0068414KAXPBCK29ENX",
        }),
      },
    });

    // Seed database on deployment by invoking Weekly cron
    new aws.lambda.Invocation("WeeklySeed", {
      functionName: weeklyCron.nodes.function.name,
      input: JSON.stringify({}),
    });

    // ! TODO @KevinWu098: figure out the router
    // Redirect peterplate.com and www.peterplate.com to peterplate.com
    // if ($app.stage === "production") {
    //   new sst.aws.Router("PeterplateRedirect", {
    //     domain: {
    //       name: "peterplate.com",
    //       redirects: ["www.peterplate.com"],
    //       dns: sst.aws.dns({
    //         zone: "Z05683903NC7KZ5HQGFOI",
    //       }),
    //     },
    //     edge: {
    //       viewerRequest: {
    //         injection: `
    //           return {
    //             statusCode: 301,
    //             statusDescription: 'Moved Permanently',
    //             headers: {
    //               'location': { value: 'https://peterplate.com' + event.request.uri }
    //             }
    //           };
    //         `,
    //       },
    //     },
    //   });
    // }

    return {
      api: api.url,
      site: site.url,
    };
  },
});
