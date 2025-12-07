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

export default $config({
  app(input) {
    return {
      name: "zotmeal",
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
    const api = new sst.aws.ApiGatewayV2("Api");

    api.route("ANY /{proxy+}", {
      handler: "apps/server/src/functions/trpc/handler.main",
      memory: "256 MB",
      environment: {
        DATABASE_URL: process.env.DATABASE_URL!,
        NODE_ENV: process.env.NODE_ENV || "development",
      },
      copyFiles: [
        {
          from: "apps/server/certs",
          to: "certs",
        },
      ],
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

    new sst.aws.Cron("Daily", {
      schedule: "cron(0 0 * * ? *)", // Run daily at 00:00 UTC
      job: {
        handler: "apps/server/src/functions/cron/daily.main",
        timeout: "10 minutes",
        environment: {
          DATABASE_URL: process.env.DATABASE_URL!,
          NODE_ENV: process.env.NODE_ENV || "development",
        },
        copyFiles: [
          {
            from: "apps/server/certs",
            to: "certs",
          },
        ],
      },
    });

    new sst.aws.Cron("Weekly", {
      schedule: "cron(0 0 ? * 1 *)", // Run at 00:00 on Sunday
      job: {
        handler: "apps/server/src/functions/cron/weekly.main",
        timeout: "10 minutes",
        environment: {
          DATABASE_URL: process.env.DATABASE_URL!,
          NODE_ENV: process.env.NODE_ENV || "development",
        },
        copyFiles: [
          {
            from: "apps/server/certs",
            to: "certs",
          },
        ],
      },
    });

    const domain = getDomain();
    const site = new sst.aws.Nextjs("site", {
      path: "apps/next",
      environment: {
        NEXT_PUBLIC_API_URL: api.url,
      },
      domain: {
        name: domain,
        redirects: [`www.${domain}`],
      },
    });

    return {
      api: api.url,
      site: site.url,
    };
  },
});
