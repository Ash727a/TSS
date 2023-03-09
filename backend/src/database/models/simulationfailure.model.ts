/**
 * This model is for storing the current telemetry state and data of all rooms
 */
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
@Table
export default class simulationfailure extends Model {
  // ID (PK) // edit later
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  // Room ID
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare room: number;

  // Start time
  @AllowNull(true)
  @Column(DataType.STRING)
  declare started_at: string;

  // O2 Error
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare o2_error: boolean;

  // Pump Error
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare pump_error: boolean;

  // Power Error
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare power_error: boolean;

  // Fan Error
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare fan_error: boolean;

  // O2 Error ID (FK)
  @AllowNull(true)
  @Column(DataType.STRING)
  declare o2_error_id: string;

  // Pump Error ID (FK)
  @AllowNull(true)
  @Column(DataType.STRING)
  declare pump_error_id: string;

  // Power Error ID (FK)
  @AllowNull(true)
  @Column(DataType.STRING)
  declare power_error_id: string;

  // Fan Error ID (FK)
  @AllowNull(true)
  @Column(DataType.STRING)
  declare fan_error_id: string;
}
