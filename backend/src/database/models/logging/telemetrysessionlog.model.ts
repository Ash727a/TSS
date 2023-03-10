import { AllowNull, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

/** MODEL: telemetrySessionLog
 * This model is for storing a log history of all telemetry sessions "START" and "STOP" in all rooms.
 * @column session_log_id Telemetry session ID (PK)
 * @column room_id Room ID it was assigned to (FK)
 * @column start_time Time the telemetry session was started AKA "START" button was pressed
 * @column end_time Time the telemetry session was stopped AKA "STOP" button was pressed
 */

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
@Table({ tableName: 'telemetrySessionLog', underscored: true })
export default class telemetrySessionLog extends Model {
  // Telemetry session ID (PK)
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING)
  declare session_log_id: string;

  // Room ID it was assigned to (FK => Room.id)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare room_id: number;

  // Time the telemetry session was started AKA "START" button was pressed
  @AllowNull(false)
  @Column(DataType.DATE)
  declare start_time: Date;

  // Time the telemetry session was stopped AKA "STOP" button was pressed
  @AllowNull(true)
  @Column(DataType.DATE)
  declare end_time: Date;
}
