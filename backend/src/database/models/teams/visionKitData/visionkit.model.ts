import { AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
@Table({ tableName: 'visionkit', underscored: true })
export default class visionkit extends Model {
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
