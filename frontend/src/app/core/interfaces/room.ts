import { SimulationError } from './telemetry';

export interface Room {
  id: number;
  session_log_id: string,
  name: string;
  status: string;
  userConnected: boolean;
  station: string;
  updatedAt: Date;
  createdAt: Date;
  users: number;
  station_name: string;
  errors: SimulationError[];
}
