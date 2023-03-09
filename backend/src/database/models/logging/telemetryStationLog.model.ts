import { AllowNull, Column, DataType, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';

/** MODEL: telemetryStationLog
 * This model is for storing logs of all stations assigned in all rooms.
 * @column id Station Assignment ID
 * @column session_id Telemetry Session ID (FK)
 * @column room_id Room ID it was assigned to (FK)
 * @column station_name The name of the station that was assigned
 * @column start_time Time the station was assigned to the room
 * @column end_time Time the station was unassigned from the room (is the time completed, if it was completed)
 * @column completed True if the station was completed AKA considered "Passed", if false, it means the task was "Failed"
 */

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
@Table({ tableName: 'telemetryStationLog', underscored: true })
export default class telemetryStationLog extends Model {
  // Station Assignment ID
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING)
  declare id: string;

  // Telemetry Session ID (FK)
  @AllowNull(false)
  @Column(DataType.STRING)
  declare session_id: string;

  // Room ID it was assigned to (FK)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare room_id: number;

  // The name of the station that was assigned
  @AllowNull(false)
  @Column(DataType.STRING)
  declare station_name: string;

  // Time the station was assigned to the room
  @AllowNull(false)
  @Column(DataType.DATE)
  declare start_time: Date;

  // Time the station was unassigned from the room (is the time completed, if it was completed)
  @AllowNull(true)
  @Column(DataType.DATE)
  declare end_time: Date;

  // True if the station was completed AKA considered "Passed", if false, it means the task was "Failed"
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare completed: boolean;
}
