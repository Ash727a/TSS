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

// We export a class that defines the model, a table in the database
@Table({ tableName: 'room', underscored: true })
export default class room extends Model {
  // Room ID (PK)
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  // Room name
  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  // Telemetry session ID (FK)
  // @ForeignKey(() => TelemetrySessionLog)
  @AllowNull(true)
  @Column(DataType.STRING)
  declare session_id: string;

  // Number of users in the room
  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare users: number;

  // Station name
  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING)
  declare stationName: string;

  // Station Log ID (FK)
  // @ForeignKey(() => StationLog)
  @AllowNull(false)
  @Default('')
  @Column(DataType.STRING)
  declare station_id: string;
}
