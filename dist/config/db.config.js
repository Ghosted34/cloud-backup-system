var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user.js";
import { File } from "../models/file.js";
import { Folder } from "../models/folder.js";
class Database {
    constructor() {
        this.POSTGRES_DB = process.env.DATABASE;
        this.POSTGRES_HOST = process.env.HOST;
        this.POSTGRES_USER = process.env.USER;
        this.POSTGRES_PASSWORD = process.env.PASSWORD;
        this.POSTGRES_PORT = Number(process.env.DB_PORT);
        this.connectToDB();
        this.connectToRedis();
    }
    connectToDB() {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield this.sequelize.authenticate();
                console.log("✅ database connection has been established");
            }
            catch (error) {
                console.log("❌ unable to connect to database   ");
                console.log(error);
            }
        });
    }
    connectToRedis() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("✅ redis connection has been established");
            }
            catch (error) {
                console.log("❌ redis to connect to database   ");
            }
        });
    }
}
export default Database;
