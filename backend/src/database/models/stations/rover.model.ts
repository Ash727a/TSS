import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table, Default } from 'sequelize-typescript';

/** MODEL: rover
 * This model is for holding live ROV states and data for all rooms.
 * @column room_id Room ID (PK)
 * @column command Command to send to ROV
 * @column goal_lat Goal latitude coordinate
 * @column goal_lon Goal longitude coordinate
 */

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
@Table({ tableName: 'rover', underscored: true })
export default class rover extends Model<InferAttributes<rover>, InferCreationAttributes<rover>> {
  // Room ID (PK => room.id)
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare room_id: number;

  @Default('')
  @Column(DataType.STRING)
  declare cmd: string;

  @Default(0)
  @Column(DataType.FLOAT)
  declare goal_lat: number;

  @Default(0)
  @Column(DataType.FLOAT)
  declare goal_lon: number;
}
