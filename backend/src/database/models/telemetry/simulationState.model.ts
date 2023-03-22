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

/** MODEL: simulationState
 * This is the model for the simulation state.
 * @column room_id: Room ID (PK)
 * @column is_running: Is the simulation running?
 * @column is_paused: Is the simulation paused?
 * @column time: Current simulation time
 * @column timer: Current simulation timer
 * @column started_at: Current simulation start time
 * @column primary_oxygen: Oxygen primary
 * @column secondary_oxygen: Oxygen secondary
 * @column suit_pressure: Suit pressure
 * @column sub_pressure: Sub pressure
 * @column o2_pressure: O2 pressure
 * @column o2_rate: O2 rate
 * @column h2o_gas_pressure: H2O gas pressure
 * @column h2o_liquid_pressure: H2O liquid pressure
 * @column sop_pressure: SOP pressure
 * @column sop_rate: SOP rate
 * @column heart_rate: Heart rate
 * @column fan_tachometer: Fan tachometer
 * @column battery_capacity: Battery capacity
 * @column temperature: Temperature
 * @column battery_time_left: Battery time left
 * @column o2_time_left: O2 time left
 * @column h2o_time_left: H2O time left
 * @column battery_percentage: Battery percentage
 * @column battery_outputput: Battery output
 * @column oxygen_primary_time: Oxygen primary time
 * @column oxygen_secondary_time: Oxygen secondary time
 * @column water_capacity: Water capacity
 */

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
@Table({ tableName: 'simulationState', underscored: true })
export default class simulationState extends Model {
  // Room ID (PK)
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare room_id: number;

  // Is the simulation running?
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare is_running: boolean;

  // Is the simulation paused?
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare is_paused: boolean;

  // Current simulation time
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare time: number;

  // Current simulation timer
  @AllowNull(false)
  @Default('00:00:00')
  @Column(DataType.STRING)
  declare timer: string;

  // Current simulation start time
  @AllowNull(false)
  @Default('00:00:00')
  @Column(DataType.STRING)
  declare started_at: string;

  // Oxygen primary
  @AllowNull(false)
  @Default(100)
  @Column(DataType.NUMBER)
  declare primary_oxygen: number;

  // Oxygen secondary
  @AllowNull(false)
  @Default(100)
  @Column(DataType.NUMBER)
  declare secondary_oxygen: number;

  // Current pressure in suit
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare suit_pressure: number;

  // Current pressure in sub
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare sub_pressure: number;

  // Current O2 pressure
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare o2_pressure: number;

  // Current O2 rate
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare o2_rate: number;

  // Current H2O pressure in gas tank
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare h2o_gas_pressure: number;

  // Current H2O pressure in liquid tank
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare h2o_liquid_pressure: number;

  // Current SOP pressure
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare sop_pressure: number;

  // Current SOP rate
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare sop_rate: number;

  // Current heart rate (BPM)
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare heart_rate: number;

  // Current fan tachometer speed
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare fan_tachometer: number;

  // Current battery capacity
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare battery_capacity: number;

  // Current temperature in suit
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare temperature: number;

  // Current battery time left
  @AllowNull(false)
  @Default('00:00:00')
  @Column(DataType.STRING)
  declare battery_time_left: string;

  // Current oxygen time left
  @AllowNull(false)
  @Default('00:00:00')
  @Column(DataType.STRING)
  declare o2_time_left: string;

  // Current water time left
  @AllowNull(false)
  @Default('00:00:00')
  @Column(DataType.STRING)
  declare h2o_time_left: string;

  // Current battery percentage
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare battery_percentage: number;

  // Current battery output
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare battery_outputput: number;

  // Oxygen primary time
  @AllowNull(false)
  @Default(100)
  @Column(DataType.NUMBER)
  declare oxygen_primary_time: number;

  // Oxygen secondary time
  @AllowNull(false)
  @Default(100)
  @Column(DataType.NUMBER)
  declare oxygen_secondary_time: number;

  // Water capacity
  @AllowNull(false)
  @Default('00:00:00')
  @Column(DataType.STRING)
  declare water_capacity: string;
}
