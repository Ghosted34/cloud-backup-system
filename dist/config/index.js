import "dotenv/config";
// Server connection
export const port = process.env.PORT || "";
// Enviroment
export const nodeEnv = process.env.NODE_ENV || "dev";
// Database connection
export const db = process.env.DATABASE || "";
export const dbUSer = process.env.USER || "";
export const dbHost = process.env.HOST || "";
export const dbPass = process.env.PASSWORD || "";
export const dialect = process.env.DIALECT || "";
export const dbPort = process.env.DB_PORT || "";
// JWT
export const jwtSecret = process.env.JWT_SECRET || "";
export const jwtExpires = process.env.JWT_EXPIRES_IN || "";
export const cookieExpires = process.env.JWT_COOKIE_EXPIERS_IN || "";
// AWS
export const awsID = process.env.AWS_ID || "";
export const awsBucket = process.env.AWS_BUCKET || "";
export const awsKey = process.env.AWS_KEY || "";
export const awsRegion = process.env.AWS_REGION || "";
