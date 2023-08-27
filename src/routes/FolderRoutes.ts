import { Router } from "express";
import BaseRoutes from "./base/BaseRoutes.js";
import { FolderController } from "../controller/FolderController.js";
import { authenticate, isLoggedIn } from "../middlewares/authMiddleware.js";

const router: Router = Router();

router.post(
  "/createFolder",
  authenticate,
  isLoggedIn,
  FolderController.createFolder
);

class FolderRoutes extends BaseRoutes {
  public routes(): void {
    this.router.post(
      "/createFolder",
      authenticate,
      isLoggedIn,
      FolderController.createFolder
    );
  }
}

export default new FolderRoutes().router;
