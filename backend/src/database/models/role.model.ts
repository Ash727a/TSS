import { AllowNull, AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ tableName: 'role', underscored: true })
export default class role extends Model {
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
