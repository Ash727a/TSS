import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { AllowNull, AutoIncrement, Column, DataType, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';

/** MODEL: user
 * This is the model for the users.
 * @column id: User ID (PK)
 * @column name: User name
 * @column room: Room ID (FK)
 * @column guid: User GUID
 */

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
@Table({ tableName: 'user', underscored: true })
export default class user extends Model<InferAttributes<user>, InferCreationAttributes<user>> {
  // User ID (PK)
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  // User name
  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  // Room ID (FK)
  // @ForeignKey(() => Room)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare room_id: number;

  // User GUID
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUIDV4)
  declare guid: string;
}
