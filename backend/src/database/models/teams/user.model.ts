import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import { AllowNull, AutoIncrement, Column, DataType, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';

/** MODEL: user
 * This is the model for the users.
 * @column user_guid: User GUID (PK)
 * @column name: User name
 * @column room: Room ID (FK)
 */

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
@Table({ tableName: 'user', underscored: true })
export default class user extends Model<InferAttributes<user>, InferCreationAttributes<user>> {
  // User GUID (PK)
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.UUIDV4)
  declare user_guid: CreationOptional<string>;

  // User name
  @AllowNull(false)
  @Column(DataType.STRING)
  declare username: string;

  // Room ID (FK)
  // @ForeignKey(() => room)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare room_id: number;
}

export type UserCreationAttributes = InferCreationAttributes<user>;
