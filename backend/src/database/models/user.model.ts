import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
@Table({ tableName: 'user', underscored: true })
export default class user extends Model {
  // User ID (PK)
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  public declare id: number;

  // User name
  @AllowNull(false)
  @Column(DataType.STRING)
  public name!: string;

  // Room ID (FK)
  // @ForeignKey(() => Room)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  public room!: number;

  // User GUID
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUIDV4)
  public guid!: string;
}
