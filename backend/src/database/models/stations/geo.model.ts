import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

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
@Table({ tableName: 'geo', underscored: true })
export default class geo extends Model<InferAttributes<geo>, InferCreationAttributes<geo>> {
  // Room ID (PK => room.id)
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare room_id: number;

  @Column(DataType.STRING)
  declare rock_tag_id?: string;

  @Column(DataType.STRING)
  declare rock_data?: string;
}
