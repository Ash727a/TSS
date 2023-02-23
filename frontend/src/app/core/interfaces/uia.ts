export interface UIAData {
  O2_vent: boolean;
  createdAt: Date;
  depress_pump: boolean;
  emu1: boolean;
  emu1_O2: boolean;
  emu2: boolean;
  emu2_O2: boolean;
  ev1_supply: boolean;
  ev1_waste: boolean;
  ev2_supply: boolean;
  ev2_waste: boolean;
  id: number;
  room: number;
  started_at: Date;
  updatedAt: Date;
}

export interface StatusSensor {
  name: string;
  status: boolean;
}
