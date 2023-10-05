export interface UIAData {
  room_id: number,
  started_at: Date;
  emu1_pwr_switch: boolean;
  ev1_water_supply_switch: boolean;
  ev1_water_waste_switch: boolean;
  emu1_o2_supply_switch: boolean;
  emu2_pwr_switch: boolean;
  ev2_water_supply_switch: boolean;
  ev2_water_waste_switch: boolean;
  emu2_o2_supply_switch: boolean;
  o2_vent_switch: boolean;
  depress_pump_switch: boolean;
  depress_pump_fault: boolean;
  createdAt: Date,
  updatedAt: Date,
}

export interface StatusSensor {
  name: string;
  status: boolean | undefined;
  key: string;
}
