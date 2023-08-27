import { Request } from "express";

const formatLog = (req: Request, message: any): string => {
  return `[${req.method} ${req.originalUrl}] ${message}`;
};

export default formatLog;
