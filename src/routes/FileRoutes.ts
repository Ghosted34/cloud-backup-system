import { Router } from "express";
import { FileController } from "../controller/FileController.js";
import BaseRoutes from "./base/BaseRoutes.js";
import upload from "../utils/aws/index.js";
import { authenticate, isLoggedIn } from "../middlewares/authMiddleware.js";

const router: Router = Router();

router.post(
  "/upload",
  authenticate,
  isLoggedIn,
  upload.single("file"),
  FileController.uploadFile
);
router.post(
  "/uploadToFolder",
  authenticate,
  isLoggedIn,
  upload.single("file"),
  FileController.uploadFileToFolder
);

router.get(
  "/download/:fileKey",
  authenticate,
  isLoggedIn,
  FileController.downloadFile
);
router.get(
  "/download-compress/:fileKey",
  authenticate,
  isLoggedIn,
  FileController.downloadCompressedFile
);
router.get(
  "/stream/:fileKey",
  authenticate,
  isLoggedIn,
  FileController.streamMediaFile
);

router.get("/history", authenticate, isLoggedIn, FileController.getFileHistory);

class FileRoutes extends BaseRoutes {
  public routes(): void {
    this.router.post(
      "/upload",
      authenticate,
      isLoggedIn,
      upload.single("file"),
      FileController.uploadFile
    );
    this.router.post(
      "/uploadToFolder",
      authenticate,
      isLoggedIn,
      upload.single("file"),
      FileController.uploadFileToFolder
    );

    this.router.get(
      "/download/:fileKey",
      authenticate,
      isLoggedIn,
      FileController.downloadFile
    );
    this.router.get(
      "/download-compress/:fileKey",
      authenticate,
      isLoggedIn,
      FileController.downloadCompressedFile
    );
    this.router.get(
      "/stream/:fileKey",
      authenticate,
      isLoggedIn,
      FileController.streamMediaFile
    );

    this.router.get(
      "/history",
      authenticate,
      isLoggedIn,
      FileController.getFileHistory
    );
  }
}

export default new FileRoutes().router;
