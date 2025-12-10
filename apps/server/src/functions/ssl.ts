import fs from "fs";
import path from "path";
import { ConnectionOptions } from "tls";

// In production (SST/Lambda), certs are copied to the root via copyFiles config
// In development, certs are at the original location relative to this file
const getCertPath = () => {
  if (process.env.NODE_ENV === "production") {
    // SST copies certs to the Lambda root directory
    return path.join(process.cwd(), "certs", "global-bundle.pem");
  }
  // Local development path
  return path.join(__dirname, "../../../certs", "global-bundle.pem");
};

export const ssl =
  process.env.NODE_ENV === "production"
    ? ({
        rejectUnauthorized: false,
        ca: fs.readFileSync(getCertPath()),
      } satisfies ConnectionOptions)
    : undefined;
