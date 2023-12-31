import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import Database from "./config/db.config.js";
import globalErrorHandler from "./utils/globalErrorHandler.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import FileRoutes from "./routes/FileRoutes.js";
import FolderRoutes from "./routes/FolderRoutes.js";
import AdminRoutes from "./routes/AdminRoutes.js";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.middleware();
    this.databaseSync();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(morgan("dev"));
  }

  // Database and Redis connection
  protected databaseSync(): void {
    const db = new Database();
    db.sequelize?.sync();
  }

  protected routes(): void {
    this.app.get("/", (req, res, next) => {
      res.send("Hello World");
    });

    this.app.use("/api/user", UserRoutes);
    this.app.use("/api", AuthRoutes);
    this.app.use("/api/file", FileRoutes);
    this.app.use("/api/folder", FolderRoutes);
    this.app.use("/api/admin", AdminRoutes);

    this.app.use("*", (req, res, next) => {
      res.status(404).send("The route you're looking for does not exist");
    });
    this.app.use(globalErrorHandler);
  }
}

export default new App().app;
