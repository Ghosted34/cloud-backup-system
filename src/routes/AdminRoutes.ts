import { Router } from "express";
import BaseRoutes from "./base/BaseRoutes.js";
import { AdminController } from "../controller/AdminController.js";
import {
  authenticate,
  authorize,
  isLoggedIn,
} from "../middlewares/authMiddleware.js";

const router: Router = Router();

router.get(
  "/getUsers",
  authenticate,
  authorize("admin"),
  AdminController.getAllUsers
);
router.get(
  "/getUser",
  authenticate,
  authorize("admin"),
  AdminController.getUserbyId
);
router.patch(
  "/markFile",
  authenticate,
  authorize("admin"),
  AdminController.markFileUnsafe
);
router.patch(
  "/markFiles",
  authenticate,
  authorize("admin"),
  AdminController.markFilesUnsafe
);
router.delete(
  "/deleteUnsafe",
  authenticate,
  authorize("admin"),
  AdminController.deleteUnsafeFiles
);

class UserRoutes extends BaseRoutes {
  public routes(): void {
    this.router.get(
      "/getUsers",
      authenticate,
      authorize("admin"),
      AdminController.getAllUsers
    );
    this.router.get(
      "/getUser",
      authenticate,
      authorize("admin"),
      AdminController.getUserbyId
    );
    this.router.patch(
      "/markFile",
      authenticate,
      authorize("admin"),
      AdminController.markFileUnsafe
    );
    this.router.patch(
      "/markFiles",
      authenticate,
      authorize("admin"),
      AdminController.markFilesUnsafe
    );
    this.router.delete(
      "/deleteUnsafe",
      authenticate,
      authorize("admin"),
      AdminController.deleteUnsafeFiles
    );
  }
}

export default new UserRoutes().router;
