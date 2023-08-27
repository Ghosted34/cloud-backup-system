import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

import logger from "./log/logger.js";
import { errorResponse } from "../utils/customResponse.js";
import AppError from "./AppError.js";
import jwt from "jsonwebtoken";
import { UniqueConstraintError } from "sequelize";
import { MulterError } from "multer";
const { JsonWebTokenError } = jwt;
const errorHandler = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // try {
  //   console.log(1);
  //   next();
  // } catch (error: any) {
  //   res.status(error.statusCode).json(error?.message);
  // }

  let message = "Oops, something went wrong. Please try again later";
  let errCode = 500;

  if (err instanceof AppError) {
    message = err.message;
    errCode = err.statusCode;
  } else if (err instanceof JsonWebTokenError) {
    //handle jwt errors
    message = err.message;
    errCode = 403;
  } else if (err instanceof UniqueConstraintError) {
    message = err.message;
    errCode = 400;
  } else if (err instanceof MulterError) {
    //handle multer errors
    message = err.message;
    errCode = 422;
  } else if (
    err instanceof SyntaxError ||
    err instanceof EvalError ||
    err instanceof RangeError ||
    err instanceof ReferenceError ||
    err instanceof TypeError ||
    err instanceof URIError
  ) {
    console.log("here");
    //handle global error types
    message = "Something went very wrong";
    errCode = 500;
  }

  console.log(err);

  logger.error(
    `[${req.method} ${req.url}] ${
      //convert other data types to strings to ensure readability in logs
      typeof message === "string" ? message : JSON.stringify(message)
    }`
  );
  // if (nodeEnv === "err") console.error(err);
  console.log(err);

  // delete any uploaded file
  // if (req.file) deleteSingleFile(req, (req.file as UploadFile).key);
  // else if (req.files) {
  //   const filepaths = [];
  //   //flatten all file objects to be in a single array
  //   const files = [].concat(...Object.values(req.files));

  //   if (files.length) {
  //     for (const file of files) {
  //       filepaths.push({ Key: (file as UploadFile).key });
  //     }
  //     deleteMultipleFiles(req, filepaths);
  //   }
  // }

  errorResponse(res, errCode, message);
  next();
};

export default errorHandler;
