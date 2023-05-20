import { CreationAttributes, InferAttributes, InferCreationAttributes, where } from 'sequelize';
import type { IAllModels } from '../../database/models';
import uia from '../../database/models/stations/uia.model';
import uiaState from '../../database/models/stations/uiaState.model';
import { Model } from 'sequelize-typescript';
import { WATER, AIRLOCK_PRESSURE, SUPPLY_PRESSURE, EMU1_POWER } from './UIA_Values.js';
import * as util from 'node:util';

type UIASimModels = Pick<IAllModels, 'uia' | 'uiaState'>;
const POLL_INTERVAL = 1000 as const;

/**
STEP 2 & 3: WHEN O2 VENT -> OPEN
1. Decrease Supply Pressure until Supply Pressure < 23 psi

STEP 3 & 4 & 7: WHEN O2 SUPPLY -> OPEN
(3) Increase Supply Pressure until Supply Pressure > 3000 psi

(4) Increase Supply Pressure until Supply Pressure > 1500 psi

(7) Increase Supply Pressure until Supply Pressure > 3000 psi

STEP 5: WHEN EV-1 Waste -> OPEN
1. Decrease Water Level until Water Level < 5%

WHEN EV-1 Supply -> OPEN
1. Increase Water Level until Water Level > 95%

STEP 6 & 8: WHEN DEPRESS PUMP -> OPEN
(6) 1. FORCE PUMP to FAULT
(6) 2. WHEN DEPRESS PUMP -> CLOSE
(6) 3. PUMP to NOT FAULT
(6) 4. WHEN DEPRESS PUMP -> OPEN
(6) 5. Decrease airlock pressure until airlock pressure < 10.2 psi

(8) 1. Decrease airlock pressure untul airlock pressure < 0.1 psi
 */

export default class UIASim {
  private readonly models: UIASimModels;
  private previous_uia_switches: uia;
  private current_uia_switches: uia;
  private last_sim_update = 0;

  private current_uia_state: uiaState;

  private room_id: number;
  private simTimer: ReturnType<typeof setTimeout> | undefined = undefined;

  constructor(uia_models: UIASimModels, room_id: number, initial_uia_state: uiaState, initial_uia_switches: uia) {
    this.models = uia_models;
    this.room_id = room_id;

    this.current_uia_state = initial_uia_state;
    this.current_uia_switches = initial_uia_switches;

    this.previous_uia_switches = structuredClone(this.current_uia_switches);
  }

  public static async build(uia_models: UIASimModels, room_id: number): Promise<UIASim | void> {
    const initial_uia_switches = (await uia_models.uia
      .findByPk(room_id)
      .then((current_uia) => current_uia?.get())) as uia;
    if (initial_uia_switches == null) {
      console.log(`No uia switch state found for room_id ${room_id} in the uia table`);
      return;
    }

    const initial_uia_state = (await uia_models.uiaState
      .findByPk(room_id)
      .then((current_uiaState) => current_uiaState?.get())) as uiaState;
    const uiaSimState = await uia_models.uiaState.findOne({ where: { room_id: room_id } });
    if (uiaSimState == null) {
      console.log(`No uia state found for room_id ${room_id} in the uiaState table`);
      return;
    }

    return new UIASim(uia_models, room_id, initial_uia_state, initial_uia_switches);
  }

  public async start_sim(): Promise<void> {
    console.log('Starting UIA Sim');
    this.simTimer = setInterval(async () => {
      this.step();
    }, POLL_INTERVAL);
  }

  private async step(): Promise<void> {
    // console.log('Stepping');
    // console.log(`\nUIA Switches: ${util.inspect(this.current_uia_switches.get())}`);
    await this.update_sim_variables();

    if (!this.current_uia_state) {
      console.log(`current_uia_state is: ${this.current_uia_state}, skipping sim step`);
      return;
    }

    if (!this.current_uia_switches) {
      console.log(`current_uia_switches is: ${this.current_uia_switches}, skipping sim step`);
      return;
    }

    const dt_secs = Date.now() / 1000 - this.last_sim_update;
    this.last_sim_update = Date.now() / 1000;

    this.current_uia_state.uia_supply_pressure = this.step_uia_supply_pressure(dt_secs);
    // console.log(`supply pressure:${this.current_uia_state.uia_supply_pressure}`);

    this.current_uia_state.water_level = this.step_uia_water_level(dt_secs);
    // console.log(`water level:${this.current_uia_state.water_level}`);

    this.current_uia_state.airlock_pressure = this.step_airlock_pressure(dt_secs);
    // console.log(`airlock pressure:${this.current_uia_state.airlock_pressure}`);

    this.models.uiaState.update(this.current_uia_state, { where: { room_id: this.room_id } });

    this.emu1_poweron(dt_secs);
    Object.assign(this.previous_uia_switches, this.current_uia_switches);
  }

  private async update_sim_variables(): Promise<void> {
    // this.current_uia_state = (await this.models.uiaState
    //   .findByPk(this.room_id)
    //   .then((current_uiaState) => current_uiaState?.get())) as uiaState;
    // console.log('---------------------\ncurrent_uia_state:\n' + util.inspect(this.current_uia_state));

    this.current_uia_switches = (await this.models.uia
      .findByPk(this.room_id)
      .then((current_uia) => current_uia?.get())) as uia;
    // console.log('---------------------\ncurrent_uia_switches:\n' + util.inspect(this.current_uia_switches));
  }

  /**
   * DEALS WITH: SUPPLY PRESSURE
   * - STEP 2 & 3: WHEN O2 VENT -> OPEN
   * - STEP 3 & 4 & 7: WHEN O2 SUPPLY -> OPEN
   */
  private step_uia_supply_pressure(dt_secs: number): number {
    // console.log('step_uia_supply_pressure');
    let updated_uia_supply_pressure = this.current_uia_state.uia_supply_pressure;

    // WHEN O2 SUPPLY -> OPEN, INCREASE Supply Pressure
    if (this.current_uia_switches.emu1_o2_supply_switch) {
      updated_uia_supply_pressure =
        this.current_uia_state.uia_supply_pressure + dt_secs * SUPPLY_PRESSURE.PRESSURIZATION_RATE;
    }

    // WHEN O2 VENT -> OPEN, INCREASE Supply Pressure
    if (this.current_uia_switches.o2_vent_switch) {
      updated_uia_supply_pressure =
        this.current_uia_state.uia_supply_pressure - dt_secs * SUPPLY_PRESSURE.DEPRESSURIZATION_RATE;

      if (updated_uia_supply_pressure < 0) updated_uia_supply_pressure = 0;
    }

    return updated_uia_supply_pressure;
  }

  /**
   * DEALS WITH: AIRLOCK PRESSURE
   * - STEP 6 & 8: WHEN DEPRESS PUMP -> OPEN
   */
  private step_airlock_pressure(dt_secs: number): number {
    // console.log('step_airlock_pressure');

    let updated_airlock_pressure = this.current_uia_state.airlock_pressure;

    // WHEN DEPRESS PUMP -> OPEN, INCREASE Airlock Pressure
    if (this.current_uia_switches.depress_pump_switch) {
      updated_airlock_pressure =
        this.current_uia_state.airlock_pressure - dt_secs * AIRLOCK_PRESSURE.DEPRESSURIZATION_RATE;

      if (updated_airlock_pressure < 0.0) updated_airlock_pressure = 0.0;
    }

    return updated_airlock_pressure;
  }

  /**
   * DEALS WITH: WATER LEVEL
   * - STEP 5: WHEN EV-1 Supply -> OPEN
   * - STEP 5: WHEN EV-1 Waste -> OPEN
   */
  private step_uia_water_level(dt_secs: number): number {
    // console.log('step_uia_water_level');
    let updated_water_level = this.current_uia_state.water_level;

    // WHEN O2 SUPPLY -> OPEN, INCREASE Water Level
    if (this.current_uia_switches.ev1_supply_switch) {
      updated_water_level = this.current_uia_state.uia_supply_pressure + dt_secs * WATER.FILL_RATE;

      if (updated_water_level > 100) updated_water_level = 100;
    }
    // WHEN EV-1 WASTE -> OPEN, DECREASE Water Level
    if (this.current_uia_switches.ev1_water_waste_switch) {
      updated_water_level = this.current_uia_state.uia_supply_pressure - dt_secs * WATER.EMPTY_RATE;

      if (updated_water_level < 0) updated_water_level = 0;
    }

    return updated_water_level;
  }

  /**
   * DEALS WITH: WATER LEVEL
   * - STEP 5: WHEN EV-1 Supply -> OPEN
   * - STEP 5: WHEN EV-1 Waste -> OPEN
   */
  private emu1_poweron_timeout: ReturnType<typeof setTimeout> | undefined = undefined;
  private emu1_poweron(dt_secs: number): void {
    if (this.current_uia_switches.emu1_pwr_switch == this.previous_uia_switches.emu1_pwr_switch) {
      return;
    }

    if (this.current_uia_switches.emu1_pwr_switch == true) {
      console.log('Beginning EMU1 poweron');
      setTimeout(() => {
        console.log('EMU1 Powered On');
        this.current_uia_state.emu1_is_booted = true;
      }, EMU1_POWER.BOOTUP_TIME * 1000);
    } else {
      console.log('Cancelling EMU1 poweron');
      clearTimeout(this.emu1_poweron_timeout);
      this.emu1_poweron_timeout = undefined;
      this.current_uia_state.emu1_is_booted = false;
    }
  }
}
