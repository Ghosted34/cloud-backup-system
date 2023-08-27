import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: File.FILE_TABLE_NAME,
})
export class File extends Model {
  public static FILE_TABLE_NAME = "file" as string;
  public static FILE_ID = "id" as string;
  public static FILE_NAME = "name" as string;
  public static FILE_TYPE = "type" as string;
  public static FILE_KEY = "key" as string;
  public static FILE_SAFE = "safe" as string;

  public static FILE_CREATED = "createdDate" as string;

  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    field: File.FILE_ID,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: File.FILE_NAME,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    field: File.FILE_TYPE,
  })
  type!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: File.FILE_KEY,
  })
  key!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: File.FILE_SAFE,
  })
  safe!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: new Date(),
    field: File.FILE_CREATED,
  })
  createdDate!: string;
}
