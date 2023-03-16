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

/** MODEL: simulationFailure
 * This is the model for the simulation failure.
 * @column room_id: Room ID (PK)
 * @column started_at: Start time
 * @column o2_error: O2 Error
 * @column pump_error: Pump Error
 * @column power_error: Power Error
 * @column fan_error: Fan Error
 * @column o2_error_id: O2 Error ID (FK)
 * @column pump_error_id: Pump Error ID (FK)
 * @column power_error_id: Power Error ID (FK)
 * @column fan_error_id: Fan Error ID (FK)
 */

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
@Table({ tableName: 'simulationFailure', underscored: true })
export default class simulationFailure extends Model {
  // Room ID (PK)
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare room_id: number;

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
