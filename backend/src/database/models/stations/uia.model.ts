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
@Table({ tableName: 'uia', underscored: true })
export default class uia extends Model {
  // Room ID (PK)
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare room: number;

  // Current simulation start time
  @AllowNull(true)
  @Column(DataType.STRING)
  declare started_at: string;

  // EMU1
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare emu1: boolean;

  // EV1 Supply
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare ev1_supply: boolean;

  // EV1 Waste
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare ev1_waste: boolean;

  // EMU1 O2
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare emu1_O2: boolean;

  // EMU2
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare emu2: boolean;

  // EV2 Supply
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare ev2_supply: boolean;

  // EV2 Waste
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare ev2_waste: boolean;

  // EMU2 O2
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare emu2_O2: boolean;

  // O2 Vent
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare O2_vent: boolean;

  // Depress Pump
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare depress_pump: boolean;
}
