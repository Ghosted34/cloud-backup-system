import { bool } from "aws-sdk/clients/signer";
import dotenv from "dotenv";

process.env.NODE_ENV = "development";
if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.dev" });
} else if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.prod" });
}

// Server connection
export const port: any = process.env.PORT || "";

// Enviroment
export const nodeEnv: any = process.env.NODE_ENV || "dev";

// Database connection
export const db: any = process.env.DATABASE || "";
export const dbSSL: any = process.env.DB || ("" as unknown as boolean);

// JWT
export const jwtSecret: any = process.env.JWT_SECRET || "";
export const jwtExpires: any = process.env.JWT_EXPIRES_IN || "";
export const cookieExpires: any = process.env.JWT_COOKIE_EXPIERS_IN || "";

// AWS
export const awsID: any = process.env.AWS_ID || "";
export const awsBucket: any = process.env.AWS_BUCKET || "";
export const awsKey: any = process.env.AWS_KEY || "";
export const awsRegion: any = process.env.AWS_REGION || "";

// Cron Schedule
export const cronSchedule: any = process.env.CRON_SCHEDULE || "";
