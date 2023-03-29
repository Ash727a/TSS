import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

/** MODEL: visionKit
 * This model is for the Vision Kit data.
 * @column id: HMD ID (PK)
 * @column name: HMD name
 * @column user_guid: User GUID (FK)
 */

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
@Table({ tableName: 'visionKit', underscored: true })
export default class visionKit extends Model<InferAttributes<visionKit>, InferCreationAttributes<visionKit>> {
  // HMD ID (PK)
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  // HMD name
  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  // User GUID (FK)
  @AllowNull(false)
  @Column(DataType.UUIDV4)
  declare user_guid: string;
}
