/**
 * This model is for storing logs of all telemetry sessions "START" and "STOP" in all rooms.
 */
import { AllowNull, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
@Table({ tableName: 'telemetrySessionLog', underscored: true })
export default class telemetrySessionLog extends Model {
  // Telemetry session ID (PK)
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING)
  declare session_id: string;

  // Room ID it was assigned to (FK)
  // @ForeignKey(() => Room)
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
