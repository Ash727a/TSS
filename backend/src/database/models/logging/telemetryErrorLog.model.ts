import { AllowNull, Column, DataType, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';

/** MODEL: telemetryErrorLog
 * This model is for storing a log history of errors thrown in all telemetry sessions.
 * @column error_log_id Error ID (PK)
 * @column session_log_id ID of the telemetry session where the error was thrown (FK)
 * @column room_id ID of the room where the error was thrown (FK)
 * @column error_type The type of error that was thrown. One of: ["o2", "fan", "pump", "power"]
 * @column start_time Time the error was thrown
 * @column end_time Time the error was resolved
 * @column resolved Whether the error was resolved or not
 */

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
@Table({ tableName: 'telemetryErrorLog', underscored: true })
export default class telemetryErrorLog extends Model {
  // Error ID (PK)
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.UUIDV4)
  declare error_log_id: string;

  // ID of the telemetry session where the error was thrown (FK)
  @AllowNull(false)
  @Column(DataType.UUIDV4)
  declare session_log_id: string;

  // ID of the room where the error was thrown (FK)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare room_id: number;

  // The type of error that was thrown. One of: ["o2", "fan", "pump", "power"]
  @AllowNull(false)
  @Column(DataType.STRING)
  declare error_type: string;

  // Time the error was thrown
  @AllowNull(false)
  @Column(DataType.DATE)
  declare start_time: Date;

  // Time the error stopped (is the time resolved, if it was resolved)
  @AllowNull(true)
  @Column(DataType.DATE)
  declare end_time: Date;

  // True if the error was resolved, false if not
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare resolved: boolean;
}
