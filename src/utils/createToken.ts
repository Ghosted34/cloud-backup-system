import { Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import {
  jwtSecret,
  jwtExpires,
  cookieExpires,
  nodeEnv,
} from "../config/index.js";

const signToken = (id: string) =>
  jwt.sign({ id }, jwtSecret, {
    expiresIn: jwtExpires,
  });

export const sendToken = (user: any, statusCode: any, res: Response) => {
  const token = signToken(user.id);
  const cookieOptions: any = {
    expires: new Date(Date.now() + Number(cookieExpires) * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (nodeEnv === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};
