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
