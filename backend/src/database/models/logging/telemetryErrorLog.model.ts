import { AllowNull, Column, DataType, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
@Table({ tableName: 'telemetryerrorlog', underscored: true })
export default class telemetryerrorlog extends Model {
  // Error session ID (PK)
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING)
  declare id: string;

  // ID of the telemetry session where the error was thrown (FK)
  @AllowNull(false)
  @Column(DataType.STRING)
  declare session_id: string;

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
