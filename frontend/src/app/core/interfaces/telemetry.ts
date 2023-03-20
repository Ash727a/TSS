export interface TelemetryData {
  room_id: number;
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
  battery_time_left: number;
  o2_time_left: number;
  h2o_time_left: number;
  battery_percentage: number;
  battery_outputput: number;
  oxygen_primary_time: number;
  oxygen_secondary_time: number;
  water_capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SimulationErrorData {
  room_id: number;
  fan_error: boolean;
  o2_error: boolean;
  power_error: boolean;
  pump_error: boolean;
  fan_error_id: string;
  o2_error_id: string;
  power_error_id: string;
  pump_error_id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SimulationError {
  key: SimulationErrorKey;
  name: string;
  value: boolean;
  start?: Date;
  end?: Date;
  error_id?: string;
}

export interface ValueSensor {
  name: string;
  value: string | number;
}

export enum SimulationErrorKey {
  FAN_ERROR = 'fan_error',
  O2_ERROR = 'o2_error',
  POWER_ERROR = 'power_error',
  PUMP_ERROR = 'pump_error',
}
