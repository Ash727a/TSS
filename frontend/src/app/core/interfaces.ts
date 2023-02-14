export interface Room {
  id: number;
  name: string;
  status: string;
  station: string;
  updatedAt: Date;
  createdAt: Date;
  users: number;
}

export interface StatusSensor {
  name: string;
  status: boolean;
}

export interface ValueSensor {
  name: string;
  value: string | number;
}

export interface Switch {
  name: string;
  value: boolean;
}

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
