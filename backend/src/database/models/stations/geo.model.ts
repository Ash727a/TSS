import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table, Default } from 'sequelize-typescript';
import { default_rock } from '../../../server/sockets/events/mappings/spec_data.map.js';

/** MODEL: geo
 * This model is for holding live GEO states and data for all rooms.
 * @column room_id Room ID (PK)
 * @column rock_tag_id The rock tag ID
 * @column rock_data The rock data
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

  @Default('')
  @AllowNull(false)
  @Column(DataType.STRING)
  declare rock_tag_id?: string;

  @Default('')
  @AllowNull(false)
  @Column(DataType.STRING)
  declare rock_name?: string;

  @Default(JSON.stringify(default_rock))
  @Column(DataType.STRING)
  declare rock_data?: string;
}
