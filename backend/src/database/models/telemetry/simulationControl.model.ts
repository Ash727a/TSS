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

/** MODEL: simulationControl
 * This is the model for the simulation control
 */

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
@Table({ tableName: 'simulationControl', underscored: true })
export default class simulationControl extends Model {
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

  // Suit Power
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare suit_power: boolean;

  // O2 Switch
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare o2_switch: boolean;

  // Aux
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare aux: boolean;

  // RCA
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare rca: boolean;

  // Pump
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare pump: boolean;

  // Fan Switch
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare fan_switch: boolean;
}
