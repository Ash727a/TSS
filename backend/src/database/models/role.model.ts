import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

/** MODEL: role
 * This is the model for the roles.
 * @column id: Role ID (PK)
 * @column role: Role name
 */

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
@Table({ tableName: 'role', underscored: true })
export default class role extends Model<InferAttributes<role>, InferCreationAttributes<role>> {
  // Role ID (PK)
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  // Role name
  @AllowNull(false)
  @Column(DataType.STRING)
  declare role: string;
}
