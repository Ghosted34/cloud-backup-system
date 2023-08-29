import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user.js";
import { File } from "../models/file.js";
import { Folder } from "../models/folder.js";

import { db, dbSSL } from "./index.js";

class Database {
  public sequelize: Sequelize | undefined;

  private POSTGRES_DB = db as string;
  private POSTGRES_SSL = dbSSL as boolean;

  constructor() {
    this.connectToDB();
    this.connectToRedis();
  }

  private async connectToDB() {
    try {
      this.sequelize = new Sequelize(this.POSTGRES_DB, {
        dialect: "postgres",
        models: [User, File, Folder],
        dialectOptions: {
          ssl: dbSSL,
          native: true,
        },
      });

      await this.sequelize.authenticate();

      console.log("✅ database connection has been established");
    } catch (error) {
      console.log("❌ unable to connect to database   ");
      console.log(error);
      return error;
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
