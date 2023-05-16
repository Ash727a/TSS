import { CreationAttributes, InferAttributes, InferCreationAttributes } from 'sequelize';
import { AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table, Default } from 'sequelize-typescript';

/** MODEL: gpsMsg
 * This model is for the GPS messages received from the Vision Kit.
 * @column guid: User GUID (The Vision Kit's ID) (FK)
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
@Table({ tableName: 'gpsMsg', underscored: true })
export default class gpsMsg extends Model<InferAttributes<gpsMsg>, InferCreationAttributes<gpsMsg>> {
  // User GUID (The Vision Kit's ID) (FK)
  @PrimaryKey
  @Column(DataType.STRING)
  declare user_guid?: string;

  // Mode
  @Default(0)
  @Column(DataType.INTEGER)
  declare mode: number;

  // Time
  @Default('')
  @Column(DataType.STRING)
  declare time?: string;

  // EPT
  @Default(0)
  @Column(DataType.DOUBLE)
  declare ept?: number;

  // Latitude
  @Default(0)
  @Column(DataType.DOUBLE)
  declare lat?: number;

  // Longitude
  @Default(0)
  @Column(DataType.DOUBLE)
  declare lon?: number;

  // Altitude
  @Default(0)
  @Column(DataType.DOUBLE)
  declare alt?: number;

  // EPX
  @Default(0)
  @Column(DataType.DOUBLE)
  declare epx?: number;

  // EPY
  @Default(0)
  @Column(DataType.DOUBLE)
  declare epy?: number;

  // EPV
  @Default(0)
  @Column(DataType.DOUBLE)
  declare epv?: number;

  // Track
  @Default(0)
  @Column(DataType.DOUBLE)
  declare track?: number;

  // Speed
  @Default(0)
  @Column(DataType.DOUBLE)
  declare speed?: number;

  // Climb
  @Default(0)
  @Column(DataType.DOUBLE)
  declare climb?: number;

  // EPS
  @Default(0)
  @Column(DataType.DOUBLE)
  declare eps?: number;

  // EPC
  @Default(0)
  @Column(DataType.DOUBLE)
  declare epc?: number;

  // SEMAPHORE
  @Default(0)
  @Column(DataType.STRING)
  declare fix_semaphore?: string;
}

export type GpsAttributes = InferCreationAttributes<gpsMsg>;
