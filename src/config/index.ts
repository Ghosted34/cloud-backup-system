import dotenv from "dotenv";

dotenv.config();

// Server connection
export const port: any = process.env.PORT || "";

// Enviroment
export const nodeEnv: any = process.env.NODE_ENV || "dev";

// Database connection
export const db: any = process.env.DATABASE || "";
export const dbSSL: any =
  Boolean(process.env.DB_SSL?.toLowerCase() === "true") || "";

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
export const wakeSchedule: any = process.env.WAKE_SCHEDULE || "";
