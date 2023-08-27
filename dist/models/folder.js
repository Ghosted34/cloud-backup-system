var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Folder_1;
import { Table, Model, Column, DataType, HasMany, } from "sequelize-typescript";
import { File } from "./file.js";
export let Folder = Folder_1 = class Folder extends Model {
};
Folder.FOLDER_TABLE_NAME = "folder";
Folder.FOLDER_ID = "id";
Folder.FOLDER_NAME = "name";
Folder.FOLDER_KEY = "key";
Folder.FOLDER_OWNER = "userId";
Folder.FOLDER_FOLDER = "folderId";
Folder.FOLDER_CREATED = "createdDate";
__decorate([
    Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
        field: Folder_1.FOLDER_ID,
    }),
    __metadata("design:type", String)
], Folder.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
        field: Folder_1.FOLDER_NAME,
        unique: true,
    }),
    __metadata("design:type", String)
], Folder.prototype, "name", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
        field: Folder_1.FOLDER_KEY,
    }),
    __metadata("design:type", String)
], Folder.prototype, "key", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: new Date(),
        field: Folder_1.FOLDER_CREATED,
    }),
    __metadata("design:type", String)
], Folder.prototype, "createdDate", void 0);
__decorate([
    HasMany(() => Folder_1, "folderId"),
    __metadata("design:type", Array)
], Folder.prototype, "folders", void 0);
__decorate([
    HasMany(() => File, "folderId"),
    __metadata("design:type", Array)
], Folder.prototype, "files", void 0);
Folder = Folder_1 = __decorate([
    Table({
        tableName: Folder_1.FOLDER_TABLE_NAME,
    })
], Folder);
