import { Optional } from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';

export type SequelizeModel = ModelCtor<Model<any, any>>;

export type APIRequest = { body: Optional<any, string>; params: any };

export type APIResult = {
  status: (code: number) => { send: { (errorString: string): void }; json: { (data: any): void }; end: { (): void } };
};

export interface TelemetryData {
  [index: string]: number | string | boolean | Date;
  is_running: boolean;
  is_paused: boolean;
  time: number;
  timer: string;
  started_at: string;
  primary_oxygen: number;
  secondary_oxygen: number;
  suit_pressure: number;
  sub_pressure: number;
  o2_pressure: number;
  o2_rate: number;
  h2o_gas_pressure: number;
  h2o_liquid_pressure: number;
  sop_pressure: number;
  sop_rate: number;
  heart_rate: number;
  fan_tachometer: number;
  battery_capacity: number;
  temperature: number;
  battery_time_left: string;
  o2_time_left: string;
  h2o_time_left: string;
  battery_percentage: number;
  battery_output: number;
  oxygen_primary_time: number;
  oxygen_secondary_time: number;
  water_capacity: number;
}

export const INIT_TELEMETRY_DATA: TelemetryData = {
  is_running: false,
  is_paused: false,
  time: 0,
  timer: '00:00:00',
  started_at: '00:00:00',
  primary_oxygen: 100,
  secondary_oxygen: 100,
  suit_pressure: 0,
  sub_pressure: 0,
  o2_pressure: 0,
  o2_rate: 0,
  h2o_gas_pressure: 0,
  h2o_liquid_pressure: 0,
  sop_pressure: 0,
  sop_rate: 0,
  heart_rate: 0,
  fan_tachometer: 0,
  battery_capacity: 0,
  temperature: 0,
  battery_time_left: '00:00:00',
  o2_time_left: '00:00:00',
  h2o_time_left: '00:00:00',
  battery_percentage: 100,
  battery_output: 100,
  oxygen_primary_time: 100,
  oxygen_secondary_time: 100,
  water_capacity: 100,
};
