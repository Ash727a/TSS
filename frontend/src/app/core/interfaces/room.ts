import { SimulationError } from './telemetry';

export interface Room {
  id: number;
  name: string;
  status: string;
  station: string;
  updatedAt: Date;
  createdAt: Date;
  users: number;
  stationName: string;
  errors: SimulationError[];
}
