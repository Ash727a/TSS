import { TelemetryData } from '../../interfaces.js';
import { HEART_RATE, SUIT_PRESSURE, FAN_TACHOMETER, O2_PRESSURE, O2_RATE, BATTERY_CAPACITY } from './EVA_Values.js';
import { secondsToHms, round, generateRandomValueInBounds, decreaseTimeDisplay } from './helpers.js';

function simulationStep(dt: any, failure: any, prevSimState: any): TelemetryData {
  const { room_id, is_running, is_paused, started_at } = prevSimState;
  const battery_percentage = batteryStep(dt, prevSimState).battery_percentage;
  const battery_output = batteryStep(dt, prevSimState).battery_output;
  const returnSim: TelemetryData = {
    room_id,
    is_running,
    is_paused,
    started_at,
    time: missionTimer(dt, prevSimState).time,
    timer: missionTimer(dt, prevSimState).timer,
    heart_rate: generateRandomValueInBounds(HEART_RATE, failure.fan_error, 0), // AFFECTED BY: FAN ERROR
    suit_pressure: generateRandomValueInBounds(SUIT_PRESSURE, failure.pump_error, 2), // AFFECTED BY: PUMP ERROR
    sub_pressure: pressureSUB(),
    o2_pressure: generateRandomValueInBounds(O2_PRESSURE, failure.o2_error, 0), // AFFECTED BY: O2 ERROR
    o2_rate: generateRandomValueInBounds(O2_RATE, failure.o2_error, 1), // AFFECTED BY: O2 ERROR
    h2o_gas_pressure: pressureWaterGas(),
    h2o_liquid_pressure: pressureWaterLiquid(),
    sop_pressure: pressureSOP(),
    sop_rate: rateSOP(),
    fan_tachometer: generateRandomValueInBounds(FAN_TACHOMETER, failure.fan_error, 0), // AFFECTED BY: FAN ERROR
    battery_capacity: generateRandomValueInBounds(BATTERY_CAPACITY, failure.power_error, 0), // AFFECTED BY: POWER ERROR
    battery_percentage: battery_percentage,
    battery_output: battery_output,
    temperature: tempSub(),
    battery_time_left: decreaseTimeDisplay(4, battery_percentage),
    o2_time_left: oxygenLife(dt, prevSimState).o2_time,
    h2o_time_left: decreaseTimeDisplay(5.5, battery_percentage),
    oxygen_primary_time: oxygenLife(dt, prevSimState).oxygen_primary_time,
    oxygen_secondary_time: oxygenLife(dt, prevSimState).oxygen_secondary_timeondary,
    water_capacity: waterLife(dt, prevSimState).water_capacity,
    primary_oxygen: oxygenLife(dt, prevSimState).oxPrimar_out,
    secondary_oxygen: oxygenLife(dt, prevSimState).oxSecondary_out,
  };
  return returnSim;
}

function batteryStep(dt: number, oldSimState: any): any {
  const drainRate = 100 / (4 * 60 * 60); // 4 hours of life (%/s)
  let battery_percentage = Number.parseFloat(oldSimState.battery_percentage);
  const amountDrained = drainRate * (dt / 1000); // %
  const battery_output = Math.floor(battery_percentage);
  battery_percentage = battery_percentage - amountDrained; // %
  return { battery_percentage, battery_output };
}

function oxygenLife(dt: number, oldSimState: { oxygen_primary_time: any; oxygen_secondary_time: any }): any {
  const ox_drainRate = 100 / (3 * 60 * 60); // 3 hours of life (%/s)

  const amountDrained = ox_drainRate * (dt / 1000); // %
  let oxygen_primary_time = oldSimState.oxygen_primary_time;
  let oxygen_secondary_timeondary = oldSimState.oxygen_secondary_time;

  oxygen_secondary_timeondary = oxygen_secondary_timeondary - amountDrained;

  if (oxygen_primary_time <= 0) {
    oxygen_primary_time = 0;
    oxygen_secondary_timeondary = oxygen_secondary_timeondary - amountDrained; // %
  }
  if (oxygen_secondary_timeondary <= 0) {
    oxygen_secondary_timeondary = 0;
  }
  const o2_time = secondsToHms(oxygen_primary_time / ox_drainRate + oxygen_secondary_timeondary / ox_drainRate);
  const oxPrimar_out = Math.floor(oxygen_primary_time);
  const oxSecondary_out = Math.floor(oxygen_secondary_timeondary);

  return {
    oxygen_primary_time,
    oxygen_secondary_timeondary,
    oxPrimar_out,
    oxSecondary_out,
    o2_time,
  };
}

function waterLife(dt: number, oldSimState: { water_capacity: string; h2o_time_left: any }): any {
  const drainRate = 100 / (5.5 * 60 * 60); // 5.5 hours of life (%/s)
  let water_capacity = Number.parseFloat(oldSimState.water_capacity);
  let h2o_time_left = oldSimState.h2o_time_left;

  const amountDrained = drainRate * (dt / 1000); // %
  h2o_time_left = secondsToHms(h2o_time_left / drainRate);
  water_capacity = water_capacity - amountDrained; // %

  return { water_capacity, h2o_time_left };
}

function pressureSUB(): number {
  const sub_pressure_max = 4;
  const sub_pressure_min = 3.85;
  const sub_pressure = Math.random() * (sub_pressure_max - sub_pressure_min) + sub_pressure_min;
  return round(sub_pressure);
}

function tempSub(): number {
  const temperature_max = 32;
  const temperature_min = 31.5;
  const temperature = Math.random() * (temperature_max - temperature_min) + temperature_min;
  const temperature_avg = (temperature_max + temperature_min + temperature) / 3;
  return round(temperature_avg, 1);
}

function pressureWaterGas(): number {
  const gasPressure_max = 16;
  const gasPressure_min = 14;
  const h2o_gas_pressure = Math.random() * (gasPressure_max - gasPressure_min) + gasPressure_min;
  return round(h2o_gas_pressure);
}

function pressureWaterLiquid(): number {
  const waterPressure_max = 14;
  const waterPressure_min = 16;
  const h2o_liquid_pressure = Math.random() * (waterPressure_max - waterPressure_min) + waterPressure_min;
  return round(h2o_liquid_pressure);
}

function pressureSOP(): number {
  const sopPressure_max = 850;
  const sopPressure_min = 910;
  const sop_pressure = Math.random() * (sopPressure_max - sopPressure_min) + sopPressure_min;
  const sop_pressure_avg = (sopPressure_max + sopPressure_min + sop_pressure) / 3;
  return round(sop_pressure_avg, 0);
}

function rateSOP(): number {
  const sopRate_max = 1;
  const sopRate_min = 0.6;
  const sop_rate = Math.random() * (sopRate_max - sopRate_min) + sopRate_min;
  return round(sop_rate, 1);
}

function missionTimer(dt: number, oldSimState: any): any {
  const time = oldSimState.time + dt / 1000;
  const timer = secondsToHms(time);
  return { timer, time };
}

export default {
  simulationStep,
};
