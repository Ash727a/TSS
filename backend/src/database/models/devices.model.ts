import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table, Default } from 'sequelize-typescript';

/** MODEL: devices
 * This is the model for the devices.
 * @column name: device name (PK)
 * @column is_connected: connection status
 * @column connected_at: connection timestamp
 */

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
@Table({ tableName: 'devices', underscored: true })
export default class devices extends Model<InferAttributes<devices>, InferCreationAttributes<devices>> {
  // Device name (PK)
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  // Device connection status
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare is_connected: boolean;

  // Device connection timestamp
  @AllowNull(true)
  @Default(null)
  @Column(DataType.DATE)
  declare connected_at: Date;
}
