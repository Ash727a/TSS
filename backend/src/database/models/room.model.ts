import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';

import { InferAttributes, InferCreationAttributes } from 'sequelize';

/** MODEL: room
 * This is the model for the rooms.
 * @column id: Room ID (PK)
 * @column name: Room name
 * @column session_log_id: Telemetry session ID (FK)
 * @column users: Number of users in the room
 * @column station_name: Station name
 * @column station_id: Station Log ID (FK)
 */

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.@Table({ tableName: 'room', underscored: true })
@Table({ tableName: 'room', underscored: true })
export default class room extends Model<InferAttributes<room>, InferCreationAttributes<room>>  {
  // Room ID (PK)
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  // Room name
  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  // Telemetry session ID (FK)
  // @ForeignKey(() => TelemetrySessionLog.session_log_id)
  @AllowNull(true)
  @Column(DataType.UUIDV4)
  declare session_log_id: string;

  // Number of users in the room
  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare users: number;

  // Station name
  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING)
  declare station_name: string;

  // Station Log ID (FK)
  // @ForeignKey(() => StationLog)
  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING)
  declare station_id: string;
}
