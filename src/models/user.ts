import {
  Column,
  Model,
  Table,
  DataType,
  BeforeBulkCreate,
  BeforeBulkUpdate,
  BeforeCreate,
  BeforeUpdate,
  HasMany,
} from "sequelize-typescript";
import bcrypt from "bcryptjs";
import { File } from "./file.js";
import { Folder } from "./folder.js";

@Table({
  tableName: User.USER_TABLE_NAME,
})
export class User extends Model {
  public static USER_TABLE_NAME = "user" as string;
  public static USER_FULL_NAME = "name" as string;
  public static USER_ID = "id" as string;
  public static USER_EMAIL = "email" as string;
  public static USER_PASSWORD = "password" as string;
  public static USER_ROLE = "role" as string;

  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    field: User.USER_ID,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: User.USER_FULL_NAME,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: User.USER_EMAIL,
    unique: true,
    validate: {
      isEmail: {
        msg: "Must be a valid email address",
      },
    },
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    defaultValue: "user",
    field: User.USER_ROLE,
  })
  role!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: User.USER_PASSWORD,
  })
  password!: string;

  @HasMany(() => File, "userId")
  files!: [string];

  @HasMany(() => Folder, "userId")
  folders!: [string];

  @BeforeCreate
  @BeforeBulkUpdate
  @BeforeUpdate
  @BeforeBulkCreate
  static hashPasswd = async (user: User) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  };
}
