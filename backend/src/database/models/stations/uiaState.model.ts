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
@Table({ tableName: 'uiaState', underscored: true })
export default class uiaState extends Model<InferAttributes<uiaState>, InferCreationAttributes<uiaState>> {
  // Room ID (PK => Room.id)
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare room_id: number;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare emu1_is_booted: boolean;

  @AllowNull(false)
  @Default(3000)
  @Column(DataType.NUMBER)
  declare uia_supply_pressure: number;

  @AllowNull(false)
  @Default(100)
  @Column(DataType.NUMBER)
  declare water_level: number;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare depress_pump_fault: boolean;

  @AllowNull(false)
  @Default(14.7)
  @Column(DataType.NUMBER)
  declare airlock_pressure: number;
}
