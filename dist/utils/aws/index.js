var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DeleteObjectCommand, DeleteObjectsCommand, GetObjectCommand, PutObjectCommand, S3Client, CopyObjectCommand, } from "@aws-sdk/client-s3";
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
const fileFilter = (req, file, cb) => {
    if (validFileTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
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
export const uploadFile = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = {
            Bucket: awsBucket,
            Key: `${Date.now()}-${req.file.originalname}`,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        };
        const command = new PutObjectCommand(params);
        yield s3.send(command);
        return params.Key;
    }
    catch (error) {
        console.log(error);
        logger.error(formatLog(req, "aws error"));
    }
});
export const createFolder = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = {
            Bucket: awsBucket,
            Key: `${req.body.name}/`,
        };
        const command = new PutObjectCommand(params);
        yield s3.send(command);
        return true;
    }
    catch (error) {
        console.log(error);
        logger.error(formatLog(req, "aws error"));
        return false;
    }
});
export const uploadFileToFolder = (req, folder) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = {
            Bucket: awsBucket,
            Key: `${folder}/${Date.now()}-${req.file.originalname}`,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        };
        const command = new PutObjectCommand(params);
        yield s3.send(command);
        return params.Key;
    }
    catch (error) {
        console.log(error);
        logger.error(formatLog(req, "aws error"));
    }
});
export const moveFileToFolder = (file, folder, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const copyParams = {
            Bucket: awsBucket,
            CopySource: encodeURI(`/${awsBucket}/${file}`),
            Key: `${folder}/${file}`,
        };
        const copy = new CopyObjectCommand(copyParams);
        yield s3.send(copy);
        const deleteParams = {
            Bucket: "YOUR_S3_BUCKET_NAME",
            Key: file,
        };
        const remove = new DeleteObjectCommand(deleteParams);
        yield s3.send(remove);
    }
    catch (error) {
        logger.error(formatLog(req, "aws error"));
    }
});
export const downloadFile = (req, res, key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = {
            Bucket: awsBucket,
            Key: key,
        };
        res.attachment(key);
        const filestream = Readable.from((yield s3.send(new GetObjectCommand(params))).Body);
        filestream.pipe(res);
        return;
    }
    catch (error) {
        logger.error(formatLog(req, "aws error"));
    }
});
export const downloadCompressedFile = (req, res, key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = {
            Bucket: awsBucket,
            Key: key,
        };
        res.attachment(key);
        const unCompressed = (yield s3.send(new GetObjectCommand(params)))
            .Body;
        res.setHeader("Content-Type", "application/octet-stream");
        res.setHeader("Content-Encoding", "gzip");
        const compressed = Readable.from(zlib.gzipSync(unCompressed));
        compressed.pipe(res);
        return;
    }
    catch (error) {
        logger.error(formatLog(req, "aws error"));
    }
});
export const streamMediaFile = (type, res, key, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const streamParams = {
            Bucket: awsBucket,
            Key: key,
        };
        const command = new GetObjectCommand(streamParams);
        const mediaStream = (yield s3.send(command)).Body;
        res.setHeader("Content-Type", `${type}`);
        mediaStream.on("data", (chunk) => {
            res.write(chunk);
        });
        mediaStream.on("end", () => {
            res.end();
        });
        return;
    }
    catch (error) {
        logger.error(formatLog(req, "aws error"));
    }
});
export const deleteFile = (req, filepath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = { Bucket: awsBucket, Key: filepath };
        yield s3.send(new DeleteObjectCommand(params));
    }
    catch (error) {
        logger.error(formatLog(req, "aws error"));
    }
});
export const deleteMultipleFiles = (req, filepaths) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = { Bucket: awsBucket, Delete: { Objects: filepaths } };
        yield s3.send(new DeleteObjectsCommand(params));
    }
    catch (error) {
        logger.error(formatLog(req, "aws error"));
    }
});
