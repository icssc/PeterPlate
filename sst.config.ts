// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

function isZotMeal(stage: string) {
  return stage === "zotmeal";
}

function getDomain() {
  if ($app.stage === "production") {
    return "peterplate.com";
  } else if ($app.stage.match(/^staging-(\d+)$/)) {
    return `${$app.stage}.peterplate.com`;
  } else if (isZotMeal($app.stage)) {
    throw new Error("zotmeal stage should not call getDomain");
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
    if (isZotMeal($app.stage)) {
      const redirectFunction = new sst.aws.Function("ZotMealRedirect", {
        runtime: "nodejs22.x",
        memory: "128 MB",
        handler: "infra/redirect-handler.handler",
        url: true,
      });

      new sst.aws.Router("ZotMealRouter", {
        domain: {
          name: "zotmeal.com",
          redirects: ["www.zotmeal.com"],
        },
        routes: {
          "/*": redirectFunction.url,
        },
      });

      return;
    }

    const domain = getDomain();
    const clientId = getClientId();

    /**
     * Env shared by every server function. It requires VAPID keys.
     */
    const serverEnvironment = {
      DATABASE_URL: process.env.DATABASE_URL!,
      NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY!,
      NODE_ENV: process.env.NODE_ENV || "development",
    };

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
        ...serverEnvironment,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
        BETTER_AUTH_URL: `https://${domain}`,
        AUTH_CLIENT_ID: clientId,
      },
    });

    new sst.aws.Cron("TestLog", {
      schedule: "rate(1 minute)",
      job: {
        handler: "apps/server/src/functions/cron/testLog.main",
        environment: serverEnvironment,
      },
    });

    const weeklyCron = new sst.aws.Cron("Weekly", {
      schedule: "cron(0 0 ? * 1 *)", // Run at 00:00 on Sunday
      job: {
        handler: "apps/server/src/functions/cron/weekly.main",
        timeout: "10 minutes",
        environment: serverEnvironment,
      },
    });

    // Production only: every staging stage shares the dev database, so
    // per-stage crons would send dev subscribers one copy per open PR.
    if ($app.stage === "production") {
      // Once a day before lunch. The script covers every meal period, so a
      // second run would repeat the same message.
      new sst.aws.Cron("MenuNotifications", {
        schedule: "cron(0 18 * * ? *)", // 11:00 AM PDT / 10:00 AM PST
        job: {
          handler: "apps/server/src/functions/cron/sendMenuNotification.main",
          timeout: "5 minutes",
          environment: serverEnvironment,
        },
      });

      new sst.aws.Cron("EventNotifications", {
        schedule: "cron(0 15 * * ? *)", // 8:00 AM PDT / 7:00 AM PST
        job: {
          handler:
            "apps/server/src/functions/cron/sendEventNotifications.main",
          timeout: "5 minutes",
          environment: serverEnvironment,
        },
      });
    }

    const site = new sst.aws.Nextjs("site", {
      path: "apps/next",
      environment: {
        NEXT_PUBLIC_API_URL: api.url,
        DATABASE_URL: process.env.DATABASE_URL!,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
        AUTH_CLIENT_ID: clientId,
        BETTER_AUTH_URL: `https://${domain}`,
        NEXT_PUBLIC_VAPID_PUBLIC_KEY:
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
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

    return {
      api: api.url,
      site: site.url,
    };
  },
});
