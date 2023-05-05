import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { AllowNull, AutoIncrement, Column, DataType, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';

/** MODEL: uia
 * This model is for holding live UIA states and data for all rooms.
 * @column room_id Room ID (PK)
 * @column started_at Current simulation start time
 * @column emu1_pwr_switch EMU1 Power Switch
 * @column ev1_supply_switch EV1 Supply Switch
 * @column ev1_water_waste_switch EV1 Water Waste Switch
 * @column emu1_o2_supply_switch EMU1 O2 Supply Switch
 * @column emu2_pwr_switch EMU2 Power Switch
 * @column ev2_water_supply_switch EV2 Supply Switch
 * @column ev2_water_waste_switch EV2 Water Waste Switch
 * @column emu2_o2_supply_switch EMU2 O2 Supply Switch
 * @column o2_vent_switch O2 Vent Switch
 * @column depress_pump_switch Depress Pump Switch
 * @column depress_pump_fault Depress Pump Fault
 */

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
@Table({ tableName: 'uia', underscored: true })
export default class uia extends Model<InferAttributes<uia>, InferCreationAttributes<uia>> {
  // Room ID (PK => Room.id)
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare room_id: number;

  // Current simulation start time
  @AllowNull(true)
  @Column(DataType.DATE)
  declare started_at: Date;

  // EMU1 Power Switch
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare emu1_pwr_switch: boolean;

  // EV1 Supply Switch
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare ev1_supply_switch: boolean;

  // EV1 Water Waste Switch
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare ev1_water_waste_switch: boolean;

  // EMU1 O2 Supply Switch
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare emu1_o2_supply_switch: boolean;

  // // EMU2 Power Switch
  // @AllowNull(false)
  // @Default(false)
  // @Column(DataType.BOOLEAN)
  // declare emu2_pwr_switch: boolean;

  // // EV2 Supply Switch
  // @AllowNull(false)
  // @Default(false)
  // @Column(DataType.BOOLEAN)
  // declare ev2_water_supply_switch: boolean;

  // // EV2 Water Waste Switch
  // @AllowNull(false)
  // @Default(false)
  // @Column(DataType.BOOLEAN)
  // declare ev2_water_waste_switch: boolean;

  // // EMU2 O2 Supply Switch
  // @AllowNull(false)
  // @Default(false)
  // @Column(DataType.BOOLEAN)
  // declare emu2_o2_supply_switch: boolean;

  // O2 Vent Switch
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare o2_vent_switch: boolean;

  // Depress Pump Switch
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare depress_pump_switch: boolean;

  // // Depress Pump Fault
  // @AllowNull(false)
  // @Default(false)
  // @Column(DataType.BOOLEAN)
  // declare depress_pump_fault: boolean;
}
