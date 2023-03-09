import { AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

/** MODEL: gpsmsg
 * This model is for the GPS messages received from the Vision Kit.
 * @column id: GPS message ID (PK)
 * @column device: Device ID
 * @column mode: Mode
 * @column time: Time
 * @column ept: EPT
 * @column lat: Latitude
 * @column lon: Longitude
 * @column alt: Altitude
 * @column epx: EPX
 * @column epy: EPY
 * @column epv: EPV
 * @column epc: EPC
 */

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
@Table({ tableName: 'gpsmsg', underscored: true })
export default class gpsmsg extends Model {
  // GPS message ID (PK)
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  // Device ID
  @AllowNull(true)
  @Column(DataType.STRING)
  declare device: string;

  // Mode
  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare mode: number;

  // Time
  @AllowNull(true)
  @Column(DataType.STRING)
  declare time: string;

  // EPT
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  declare ept: number;

  // Latitude
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  declare lat: number;

  // Longitude
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  declare lon: number;

  // Altitude
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  declare alt: number;

  // EPX
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  declare epx: number;

  // EPY
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  declare epy: number;

  // EPV
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  declare epv: number;

  // Track
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  declare track: number;

  // Speed
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  declare speed: number;

  // Climb
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  declare climb: number;

  // EPS
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  declare eps: number;

  // EPC
  @AllowNull(true)
  @Column(DataType.DOUBLE)
  declare epc: number;
}
