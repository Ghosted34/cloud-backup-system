var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var User_1;
import { Column, Model, Table, DataType, BeforeBulkCreate, BeforeBulkUpdate, BeforeCreate, BeforeUpdate, HasMany, } from "sequelize-typescript";
import bcrypt from "bcryptjs";
import { File } from "./file.js";
import { Folder } from "./folder.js";
export let User = User_1 = class User extends Model {
};
User.USER_TABLE_NAME = "user";
User.USER_FULL_NAME = "name";
User.USER_ID = "id";
User.USER_EMAIL = "email";
User.USER_PASSWORD = "password";
User.USER_ROLE = "role";
User.hashPasswd = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
});
__decorate([
    Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
        field: User_1.USER_ID,
    }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
        field: User_1.USER_FULL_NAME,
    }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
        field: User_1.USER_EMAIL,
        unique: true,
        validate: {
            isEmail: {
                msg: "Must be a valid email address",
            },
        },
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        defaultValue: "user",
        field: User_1.USER_ROLE,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
        field: User_1.USER_PASSWORD,
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    HasMany(() => File, "userId"),
    __metadata("design:type", Array)
], User.prototype, "files", void 0);
__decorate([
    HasMany(() => Folder, "userId"),
    __metadata("design:type", Array)
], User.prototype, "folders", void 0);
__decorate([
    BeforeCreate,
    BeforeBulkUpdate,
    BeforeUpdate,
    BeforeBulkCreate,
    __metadata("design:type", Object)
], User, "hashPasswd", void 0);
User = User_1 = __decorate([
    Table({
        tableName: User_1.USER_TABLE_NAME,
    })
], User);
