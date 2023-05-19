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
@Table({ tableName: 'specScanLog', underscored: true })
export default class specScanLog extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.UUIDV4)
  declare scan_log_id: string;

  // ID of the telemetry session where the error was thrown (FK)
  @AllowNull(false)
  @Column(DataType.UUIDV4)
  declare session_log_id: string;

  // ID of the telemetry session where the error was thrown (FK)
  @AllowNull(false)
  @Column(DataType.STRING)
  declare rock_name: string;

  // ID of the room where the error was thrown (FK)
  @Column(DataType.INTEGER)
  declare room_id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare team_name: string;

  @Default('')
  @AllowNull(false)
  @Column(DataType.STRING)
  declare rock_tag_id?: string;
}
