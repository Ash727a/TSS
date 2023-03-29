import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

/** MODEL: hmd
 * This model is for the head mounted display data.
 * @column id: HMD ID (PK)
 * @column name: HMD name
 * @column description: HMD description
 * @column assignment: HMD assignment
 * @column mac_address: HMD MAC address
 */

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
@Table({ tableName: 'hmd', underscored: true })
export default class hmd extends Model<InferAttributes<hmd>, InferCreationAttributes<hmd>> {
  // HMD ID (PK)
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  // HMD name
  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  // HMD description
  @AllowNull(true)
  @Column(DataType.STRING)
  declare description: string;

  // HMD assignment
  @AllowNull(true)
  @Column(DataType.STRING)
  declare assignment: string;

  // HMD MAC address
  @AllowNull(false)
  @Column(DataType.STRING)
  declare mac_address: string;
}
