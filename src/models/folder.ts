import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { User } from "./user.js";
import { File } from "./file.js";

@Table({
  tableName: Folder.FOLDER_TABLE_NAME,
})
export class Folder extends Model {
  public static FOLDER_TABLE_NAME = "folder" as string;
  public static FOLDER_ID = "id" as string;
  public static FOLDER_NAME = "name" as string;
  public static FOLDER_KEY = "key" as string;
  public static FOLDER_OWNER = "userId" as string;
  public static FOLDER_FOLDER = "folderId" as string;
  public static FOLDER_CREATED = "createdDate" as string;

  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    field: Folder.FOLDER_ID,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: Folder.FOLDER_NAME,
    unique: true,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: Folder.FOLDER_KEY,
  })
  key!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: new Date(),
    field: Folder.FOLDER_CREATED,
  })
  createdDate!: string;

  @HasMany(() => Folder, "folderId")
  folders!: [string];

  @HasMany(() => File, "folderId")
  files!: [string];
}
