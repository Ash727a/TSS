import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

/** MODEL: imuMsg
 * This model is for the IMU messages received from the Vision Kit.
 * @column guid: User GUID (The Vision Kit's ID) (FK)
 * @column heading: IMU message heading
 * @column accel_x: IMU message accel_x
 * @column accel_y: IMU message accel_y
 * @column accel_z: IMU message accel_z
 * @column gyro_x: IMU message gyro_x
 * @column gyro_y: IMU message gyro_y
 * @column gyro_z: IMU message gyro_z
 * @column mag_x: IMU message mag_x
 * @column mag_y: IMU message mag_y
 * @column mag_z: IMU message mag_z
 */

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
@Table({ tableName: 'imuMsg', underscored: true })
export default class imuMsg extends Model<InferAttributes<imuMsg>, InferCreationAttributes<imuMsg>> {
  // GUID (The Vision Kit's ID) (FK)
  @PrimaryKey
  @AllowNull(true)
  @Column(DataType.UUIDV4)
  declare user_guid: string;

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

export type IMUData = Omit<InferCreationAttributes<imuMsg>, keyof Model>;
export type IMUAttributes = InferCreationAttributes<imuMsg>;
