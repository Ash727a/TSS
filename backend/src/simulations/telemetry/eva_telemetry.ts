import { TelemetryData } from '../../interfaces.js';

function simulationStep(dt: any, controls: { suit_power: boolean }, failure: any, oldSimState: any): TelemetryData {
  const battery_percentage = batteryStep(dt, controls, oldSimState).battery_percentage;
  const battery_time_left = batteryStep(dt, controls, oldSimState).battery_time_left;
  const battery_output = batteryStep(dt, controls, oldSimState).battery_output;
  const returnSim: TelemetryData = {
    room_id: oldSimState.room_id,
    is_running: oldSimState.is_running,
    is_paused: oldSimState.is_paused,
    time: missionTimer(dt, oldSimState).time,
    timer: missionTimer(dt, oldSimState).timer,
    heart_rate: heartBeat(dt, controls, failure, oldSimState),
    suit_pressure: pressureSuit(dt, controls, failure, oldSimState),
    sub_pressure: pressureSUB(),
    o2_pressure: pressureOxygen(dt, controls, failure, oldSimState),
    o2_rate: rateOxygen(dt, controls, failure, oldSimState),
    h2o_gas_pressure: pressureWaterGas(),
    h2o_liquid_pressure: pressureWaterLiquid(),
    sop_pressure: pressureSOP(),
    sop_rate: rateSOP(),
    fan_tachometer: velocFan(dt, controls, failure, oldSimState),
    battery_capacity: capacityBattery(dt, controls, failure, oldSimState),
    battery_percentage: battery_percentage,
    battery_outputput: battery_output,
    temperature: tempSub(),
    battery_time_left: batteryStep(dt, controls, oldSimState).battery_time_left,
    o2_time_left: oxygenLife(dt, controls, oldSimState).o2_time,
    h2o_time_left: waterLife(dt, controls, oldSimState).h2o_time_left,
    oxygen_primary_time: oxygenLife(dt, controls, oldSimState).oxygen_primary_time,
    oxygen_secondary_time: oxygenLife(dt, controls, oldSimState).oxygen_secondary_timeondary,
    water_capacity: waterLife(dt, controls, oldSimState).water_capacity,
    primary_oxygen: oxygenLife(dt, controls, oldSimState).oxPrimar_out,
    secondary_oxygen: oxygenLife(dt, controls, oldSimState).oxSecondary_out,
    started_at: oldSimState.started_at,
  };

  return returnSim;

  function padValues(n: string | number | any[], width: number, z = '0'): string {
    n = n.toString();
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  function secondsToHms(dt: number): string {
    dt = Number(dt);
    const h = Math.floor(dt / 3600);
    const m = Math.floor((dt % 3600) / 60);
    const s = Math.floor((dt % 3600) % 60);

    const time = padValues(h, 2) + ':' + padValues(m, 2) + ':' + padValues(s, 2);
    return time;
  }

  function missionTimer(dt: number, oldSimState: any): any {
    const time = oldSimState.time + dt / 1000;
    const timer = secondsToHms(time);
    return { timer, time };
  }

  function batteryStep(dt: number, controls: { suit_power: any }, oldSimState: any): any {
    const drainRate = 100 / (4 * 60 * 60); // 4 hours of life (%/s)
    let battery_percentage = Number.parseFloat(oldSimState.battery_percentage);
    const amountDrained = drainRate * (dt / 1000); // %
    const battery_time_left = secondsToHms(battery_percentage / drainRate); // s
    const battery_output = Math.floor(battery_percentage);
    if (controls.suit_power === false) {
      battery_percentage = battery_percentage - amountDrained; // %
    }
    return { battery_percentage, battery_time_left, battery_output };
  }

  function capacityBattery(
    dt: any,
    control: { suit_power: any },
    fail: { power_error: any },
    oldSimState: any
  ): number {
    let batt_max = 0;
    let batt_min = 0;

    if (fail.power_error && !control.suit_power) {
      batt_max = 30;
      batt_min = 29.4;
    } else {
      batt_max = 45;
      batt_min = 60;
    }
    const battery_capacity = Math.random() * (batt_max - batt_min) + batt_min;
    return round(battery_capacity, 0);
  }

  function oxygenLife(
    dt: number,
    controls: { suit_power?: boolean; O2_switch?: any },
    oldSimState: { oxygen_primary_time: any; oxygen_secondary_time: any }
  ): any {
    const ox_drainRate = 100 / (3 * 60 * 60); // 3 hours of life (%/s)

    const amountDrained = ox_drainRate * (dt / 1000); // %
    let oxygen_primary_time = oldSimState.oxygen_primary_time;
    let oxygen_secondary_timeondary = oldSimState.oxygen_secondary_time;

    if (controls.O2_switch === false) {
      oxygen_primary_time = oxygen_primary_time - amountDrained; // %
    } else oxygen_secondary_timeondary = oxygen_secondary_timeondary - amountDrained;

    if (controls.O2_switch && oxygen_primary_time <= 0) {
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

  function waterLife(dt: number, controls: { suit_power: boolean }, oldSimState: { water_capacity: string }): any {
    const drainRate = 100 / (5.5 * 60 * 60); // 5.5 hours of life (%/s)
    let water_capacity = Number.parseFloat(oldSimState.water_capacity);
    const amountDrained = drainRate * (dt / 1000); // %
    const h2o_time_left = secondsToHms(water_capacity / drainRate); // s
    water_capacity = water_capacity - amountDrained; // %

    return { water_capacity, h2o_time_left };
  }

  function heartBeat(dt: any, controls: any, failure: any, oldSimState: any): number {
    let hr_max = 0;
    let hr_min = 0;
    // console.log(failure.fan_error, controls.fan_switch);
    if (failure.fan_error === true && !controls.fan_switch) {
      hr_max = Number.parseFloat(oldSimState.heart_rate) + 2;
      hr_min = Number.parseFloat(oldSimState.heart_rate);
      // **NOTE: Changed from === 120 to >= 120 to prevent overrun
      if (hr_max >= 120) {
        hr_max = 120;
        hr_min = 114;
      }
    } else {
      hr_max = 93;
      hr_min = 85;
    }

    const heart_rate = Math.random() * (hr_max - hr_min) + hr_min;
    const hr_mean = (Number.parseFloat(oldSimState.heart_rate) + heart_rate) / 2;
    const avg_hr = (heart_rate + hr_max + hr_mean + hr_min) / 4;
    return round(avg_hr, 0);
  }

  function pressureSUB(): number {
    const sub_pressure_max = 4;
    const sub_pressure_min = 3.85;
    const sub_pressure = Math.random() * (sub_pressure_max - sub_pressure_min) + sub_pressure_min;
    return round(sub_pressure);
  }

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  function round(num: number, round: number = 2): number {
    return parseFloat(num.toFixed(round));
  }

  function pressureSuit(dt: any, controls: any, failure: any, oldSimState: any): number {
    let suit_pressure_max = 0;
    let suit_pressure_min = 0;
    // console.log("PSUIT " + failure.pump_error + " " + controls.pump);
    if (failure.pump_error && !controls.pump) {
      suit_pressure_max = 2.5;
      suit_pressure_min = 1.75;
    } else {
      suit_pressure_max = 4.0;
      suit_pressure_min = 3.92;
    }
    const suit_pressure = Math.random() * (suit_pressure_max - suit_pressure_min) + suit_pressure_min;
    return round(suit_pressure);
  }

  function tempSub(): number {
    const temperature_max = 32;
    const temperature_min = 31.5;
    const temperature = Math.random() * (temperature_max - temperature_min) + temperature_min;
    const temperature_avg = (temperature_max + temperature_min + temperature) / 3;
    return round(temperature_avg, 1);
  }

  function velocFan(
    dt: any,
    controls: { suit_power?: boolean; fan_switch?: any },
    failure: { fan_error: boolean },
    oldSimState: { fan_tachometer: string }
  ): number {
    let fan_tachometer = Number.parseFloat(oldSimState.fan_tachometer);
    let fan_max = 0;
    let fan_min = 0;
    if (failure.fan_error === true && controls.fan_switch === false) {
      fan_max = 55000.0;
      fan_min = 45000.0;
    } else {
      fan_max = 40000.0;
      fan_min = 39900.0;
    }
    // else if (fan_switch === false ){
    // 	fan_tachometer = 0
    // }
    //return round((fan_tachometer/1000), 2);
    fan_tachometer = Math.random() * (fan_max - fan_min) + fan_min;
    return round(fan_tachometer, 0);
  }

  function pressureOxygen(
    dt: any,
    controls: { suit_power: boolean },
    failure: { o2_error: boolean },
    oldSimState: { o2_pressure: string }
  ): number {
    let o2_pressure = Number.parseFloat(oldSimState.o2_pressure);
    const oxPressure_max = 780;
    const oxPressure_min = 778;
    if (failure.o2_error === false) {
      // Regular state
      o2_pressure = Math.random() * (oxPressure_max - oxPressure_min) + oxPressure_min;
      // } else if (failure.o2_error === true && !controls.o2_switch) // For DCU
    } else if (failure.o2_error === true) {
      // Gradually decrease if the error is on
      const random = Math.random() * 10 + 1;
      o2_pressure -= random;
      // Bottom bound the o2 pressure to 0
      if (o2_pressure < 0) {
        o2_pressure = 0;
      }
    }
    return round(o2_pressure);
  }

  function rateOxygen(
    dt: any,
    controls: { suit_power?: boolean; o2_switch?: any },
    failure: { o2_error: boolean },
    oldSimState: any
  ): number {
    let oxRate_max = 0;
    let oxRate_min = 0;
    if (failure.o2_error == true && !controls.o2_switch) {
      oxRate_max = 0.6;
      oxRate_min = 0.4;
    } else {
      oxRate_max = 1;
      oxRate_min = 0.5;
    }
    const o2_rate = Math.random() * (oxRate_max - oxRate_min) + oxRate_min;
    return round(o2_rate);
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
}

export default {
  simulationStep,
};
