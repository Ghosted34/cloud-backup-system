var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var File_1;
import { Table, Model, Column, DataType } from "sequelize-typescript";
export let File = File_1 = class File extends Model {
};
File.FILE_TABLE_NAME = "file";
File.FILE_ID = "id";
File.FILE_NAME = "name";
File.FILE_TYPE = "type";
File.FILE_KEY = "key";
File.FILE_SAFE = "safe";
File.FILE_CREATED = "createdDate";
__decorate([
    Column({
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
        field: File_1.FILE_ID,
    }),
    __metadata("design:type", String)
], File.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
        field: File_1.FILE_NAME,
    }),
    __metadata("design:type", String)
], File.prototype, "name", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        field: File_1.FILE_TYPE,
    }),
    __metadata("design:type", String)
], File.prototype, "type", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
        field: File_1.FILE_KEY,
    }),
    __metadata("design:type", String)
], File.prototype, "key", void 0);
__decorate([
    Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: File_1.FILE_SAFE,
    }),
    __metadata("design:type", Boolean)
], File.prototype, "safe", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: new Date(),
        field: File_1.FILE_CREATED,
    }),
    __metadata("design:type", String)
], File.prototype, "createdDate", void 0);
File = File_1 = __decorate([
    Table({
        tableName: File_1.FILE_TABLE_NAME,
    })
], File);
