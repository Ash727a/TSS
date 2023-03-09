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
 * @column id: ID (PK)
 * @column is_running: Is the simulation running?
 * @column is_paused: Is the simulation paused?
 * @column time: Current simulation time
 * @column timer: Current simulation timer
 * @column started_at: Current simulation start time
 * @column heart_bpm: Current heart BPM
 * @column p_sub: Current P_sub
 * @column p_suit: Current P_suit
 * @column t_sub: Current T_sub
 * @column v_fan: Current V_fan
 * @column p_o2: Current P_o2
 * @column rate_o2: Current rate_o2
 * @column battery_percent: Current battery percent
 * @column cap_battery: Current battery capacity
 * @column battery_out: Current battery output
 * @column p_h2o_g: Current P_h2o_g
 * @column p_h2o_l: Current P_h2o_l
 * @column p_sop: Current P_sop
 * @column rate_sop: Current rate_sop
 * @column t_battery: Current battery time
 * @column t_oxygenPrimary: Current oxygen primary time
 * @column t_oxygenSec: Current oxygen secondary time
 * @column ox_primary: Current oxygen primary
 * @column ox_secondary: Current oxygen secondary
 * @column t_oxygen: Current oxygen time
 * @column cap_water: Current water capacity
 * @column t_water: Current water time
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
  declare id: number;

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

  // Current heart BPM
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare heart_bpm: number;

  // Current pressure in suit
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare p_sub: number;

  // Current pressure in suit
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare p_suit: number;

  // Current temperature in suit
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare t_sub: number;

  // Current fan speed
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare v_fan: number;

  // Current O2 pressure
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare p_o2: number;

  // Current O2 rate
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare rate_o2: number;

  // Current battery percentage
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare battery_percent: number;

  // Current battery capacity
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare cap_battery: number;

  // Current battery output
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare battery_out: number;

  // Current H2O pressure in gas tank
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare p_h2o_g: number;

  // Current H2O pressure in liquid tank
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare p_h2o_l: number;

  // Current SOP pressure
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare p_sop: number;

  // Current SOP rate
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare rate_sop: number;

  // Current battery time
  @AllowNull(false)
  @Default('00:00:00')
  @Column(DataType.STRING)
  declare t_battery: string;

  // Oxygen primary time
  @AllowNull(false)
  @Default(100)
  @Column(DataType.NUMBER)
  declare t_oxygenPrimary: number;

  // Oxygen secondary time
  @AllowNull(false)
  @Default(100)
  @Column(DataType.NUMBER)
  declare t_oxygenSec: number;

  // Oxygen primary
  @AllowNull(false)
  @Default(100)
  @Column(DataType.NUMBER)
  declare ox_primary: number;

  // Oxygen secondary
  @AllowNull(false)
  @Default(100)
  @Column(DataType.NUMBER)
  declare ox_secondary: number;

  // Oxygen time
  @AllowNull(false)
  @Default('00:00:00')
  @Column(DataType.STRING)
  declare t_oxygen: string;

  // Water capacity
  @AllowNull(false)
  @Default('00:00:00')
  @Column(DataType.STRING)
  declare cap_water: string;

  // Water time
  @AllowNull(false)
  @Default('00:00:00')
  @Column(DataType.STRING)
  declare t_water: string;
}
