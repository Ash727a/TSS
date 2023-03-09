import { AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ tableName: 'imumsg', underscored: true })
export default class imumsg extends Model {
  // IMU message ID (PK)
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  // IMU message heading
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  declare heading: number;

  // IMU message accel_x
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  declare accel_x: number;

  // IMU message accel_y
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  declare accel_y: number;

  // IMU message accel_z
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  declare accel_z: number;

  // IMU message gyro_x
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  declare gyro_x: number;

  // IMU message gyro_y
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  declare gyro_y: number;

  // IMU message gyro_z
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  declare gyro_z: number;

  // IMU message mag_x
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  declare mag_x: number;

  // IMU message mag_y
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  declare mag_y: number;

  // IMU message mag_z
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  declare mag_z: number;
}
