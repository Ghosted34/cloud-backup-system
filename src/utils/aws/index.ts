import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";
import { Request, Response } from "express";
import multer from "multer";
import { awsBucket, awsID, awsKey, awsRegion } from "../../config/index.js";
import logger from "../log/logger.js";
import formatLog from "../log/formatLog.js";
import { Readable } from "stream";
import zlib from "zlib";

const s3 = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: awsID,
    secretAccessKey: awsKey,
  },
});

const validFileTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "text/csv",
  "audio/mpeg",
  "audio/mp4",
  "audio/mp3",
  "audio/ogg",
  "audio/vnd.wav",
  "audio/wave",
  "video/mp4",
  "video/3gpp",
  "video/quicktime",
  "video/x-ms-wmv",
  "video/x-msvideo",
  "video/x-flv",
  "video/mkv",
  "application/pdf",
];

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (validFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, JPG files are allowed"));
  }
};

const upload = multer({
  fileFilter,
  limits: {
    parts: Infinity,
    fileSize: 1024 * 1024 * 250, //Maximum of 200Mb file size
  },
  storage: storage,
});
export default upload;

export const uploadFile = async (req: any) => {
  try {
    const params = {
      Bucket: awsBucket,
      Key: `${Date.now()}-${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);

    await s3.send(command);
    return params.Key;
  } catch (error) {
    console.log(error);
    logger.error(formatLog(req, "aws error"));
  }
};

export const createFolder = async (req: any): Promise<any> => {
  try {
    const params = {
      Bucket: awsBucket,
      Key: `${req.body.name}/`,
    };

    const command = new PutObjectCommand(params);

    await s3.send(command);
    return true;
  } catch (error) {
    console.log(error);
    logger.error(formatLog(req, "aws error"));
    return false;
  }
};
export const uploadFileToFolder = async (
  req: any,
  folder: any
): Promise<any> => {
  try {
    const params = {
      Bucket: awsBucket,
      Key: `${folder}/${Date.now()}-${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);

    await s3.send(command);
    return params.Key;
  } catch (error) {
    console.log(error);
    logger.error(formatLog(req, "aws error"));
  }
};
export const moveFileToFolder = async (
  file: any,
  folder: any,
  req: any
): Promise<any> => {
  try {
    const copyParams = {
      Bucket: awsBucket,
      CopySource: encodeURI(`/${awsBucket}/${file}`),
      Key: `${folder}/${file}`,
    };

    const copy = new CopyObjectCommand(copyParams);
    await s3.send(copy);

    const deleteParams = {
      Bucket: "YOUR_S3_BUCKET_NAME",
      Key: file,
    };
    const remove = new DeleteObjectCommand(deleteParams);
    await s3.send(remove);
  } catch (error) {
    logger.error(formatLog(req, "aws error"));
  }
};
export const downloadFile = async (
  req: any,
  res: Response,
  key: any
): Promise<void> => {
  try {
    const params = {
      Bucket: awsBucket,
      Key: key,
    };

    res.attachment(key);

    const filestream = Readable.from(
      (await s3.send(new GetObjectCommand(params))).Body as any
    );
    filestream.pipe(res);
    return;
  } catch (error) {
    logger.error(formatLog(req, "aws error"));
  }
};

export const downloadCompressedFile = async (
  req: any,
  res: Response,
  key: any
): Promise<void> => {
  try {
    const params = {
      Bucket: awsBucket,
      Key: key,
    };

    res.attachment(key);

    const unCompressed: any = (await s3.send(new GetObjectCommand(params)))
      .Body;

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Encoding", "gzip");

    const compressed = Readable.from(zlib.gzipSync(unCompressed));

    compressed.pipe(res);
    return;
  } catch (error) {
    logger.error(formatLog(req, "aws error"));
  }
};
export const streamMediaFile = async (
  type: any,
  res: Response,
  key: any,
  req: any
): Promise<void> => {
  try {
    const streamParams = {
      Bucket: awsBucket,
      Key: key,
    };

    const command = new GetObjectCommand(streamParams);

    const mediaStream: any = (await s3.send(command)).Body;

    res.setHeader("Content-Type", `${type}`);

    mediaStream.on("data", (chunk: any) => {
      res.write(chunk);
    });

    mediaStream.on("end", () => {
      res.end();
    });

    return;
  } catch (error) {
    logger.error(formatLog(req, "aws error"));
  }
};

export const deleteFile = async (
  req: Request,
  filepath: string
): Promise<void> => {
  try {
    const params = { Bucket: awsBucket, Key: filepath };

    await s3.send(new DeleteObjectCommand(params));
  } catch (error) {
    logger.error(formatLog(req, "aws error"));
  }
};

export const deleteMultipleFiles = async (
  req: any,
  filepaths: { Key: string }[]
): Promise<void> => {
  try {
    const params = { Bucket: awsBucket, Delete: { Objects: filepaths } };

    await s3.send(new DeleteObjectsCommand(params));
  } catch (error) {
    logger.error(formatLog(req, "aws error"));
  }
};
