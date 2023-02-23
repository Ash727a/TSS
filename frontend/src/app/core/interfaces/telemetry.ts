export interface TelemetryData {
  id: number;
  room: number;
  isRunning: boolean;
  isPaused: boolean;
  time: number;
  timer: string;
  started_at: string;
  heart_bpm: string;
  p_sub: string;
  p_suit: string;
  t_sub: string;
  v_fan: string;
  p_o2: string;
  rate_o2: string;
  batteryPercent: number;
  cap_battery: string;
  battery_out: number;
  p_h2o_g: string;
  p_h2o_l: string;
  p_sop: string;
  rate_sop: string;
  t_battery: string;
  t_oxygenPrimary: number;
  t_oxygenSec: number;
  ox_primary: number;
  ox_secondary: number;
  t_oxygen: string;
  cap_water: number;
  t_water: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SimulationErrorData {
  id: number;
  room: number;
  fan_error: boolean;
  o2_error: boolean;
  power_error: boolean;
  pump_error: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SimulationError {
  key: SimulationErrorKey;
  name: string;
  value: boolean;
}

export interface ValueSensor {
  name: string;
  value: string | number;
}

export interface Switch {
  name: string;
  value: boolean;
}

export enum SimulationErrorKey {
  FAN_ERROR = 'fan_error',
  O2_ERROR = 'o2_error',
  POWER_ERROR = 'power_error',
  PUMP_ERROR = 'pump_error',
}
