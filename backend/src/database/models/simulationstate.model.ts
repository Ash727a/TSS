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
@Table({ tableName: 'simulationstate', underscored: true })
export default class simulationstate extends Model {
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

  // placeholder
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare p_sop: number;

  // placeholder
  @AllowNull(false)
  @Default(0)
  @Column(DataType.NUMBER)
  declare rate_sop: number;

  // placeholder
  @AllowNull(false)
  @Default('00:00:00')
  @Column(DataType.STRING)
  declare t_battery: string;

  // placeholder
  @AllowNull(false)
  @Default(100)
  @Column(DataType.NUMBER)
  declare t_oxygenPrimary: number;

  // placeholder
  @AllowNull(false)
  @Default(100)
  @Column(DataType.NUMBER)
  declare t_oxygenSec: number;

  // placeholder
  @AllowNull(false)
  @Default(100)
  @Column(DataType.NUMBER)
  declare ox_primary: number;

  // placeholder
  @AllowNull(false)
  @Default(100)
  @Column(DataType.NUMBER)
  declare ox_secondary: number;

  // placeholder
  @AllowNull(false)
  @Default('00:00:00')
  @Column(DataType.STRING)
  declare t_oxygen: string;

  // placeholder
  @AllowNull(false)
  @Default('00:00:00')
  @Column(DataType.STRING)
  declare cap_water: string;

  // placeholder
  @AllowNull(false)
  @Default('00:00:00')
  @Column(DataType.STRING)
  declare t_water: string;
}
