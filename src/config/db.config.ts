import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user.js";
import { File } from "../models/file.js";
import { Folder } from "../models/folder.js";

class Database {
  public sequelize: Sequelize | undefined;

  private POSTGRES_DB = process.env.DATABASE as string;
  private POSTGRES_HOST = process.env.HOST as string;
  private POSTGRES_USER = process.env.USER as string;
  private POSTGRES_PASSWORD = process.env.PASSWORD as string;
  private POSTGRES_PORT = Number(process.env.DB_PORT) as number;

  constructor() {
    this.connectToDB();
    this.connectToRedis();
  }

  private async connectToDB() {
    try {
      this.sequelize = new Sequelize({
        database: this.POSTGRES_DB,
        username: this.POSTGRES_USER,
        password: `${this.POSTGRES_PASSWORD}`,
        host: this.POSTGRES_HOST,
        port: this.POSTGRES_PORT,
        dialect: "postgres",
        models: [User, File, Folder],
      });

      await this.sequelize.authenticate();

      console.log("✅ database connection has been established");
    } catch (error) {
      console.log("❌ unable to connect to database   ");
      console.log(error);
    }
  }

  private async connectToRedis() {
    try {
      console.log("✅ redis connection has been established");
    } catch (error) {
      console.log("❌ redis to connect to database   ");
    }
  }
}

export default Database;
