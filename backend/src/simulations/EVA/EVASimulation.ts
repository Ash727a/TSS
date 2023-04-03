import { v4 as uuidv4 } from 'uuid';

import { primaryKeyOf } from '../../helpers.js';
import { INIT_TELEMETRY_DATA, TelemetryData } from '../../interfaces.js';
import simControlSeed from '../seed/simcontrol.js';
import simFailureSeed from '../seed/simfailure.js';
import evaTelemetry from '../telemetry/eva_telemetry.js';

const VERBOSE = true;
interface SimulationModels {
  simulationState: any;
  simulationControl: any;
  simulationFailure: any;
  room: any;
  telemetrySessionLog: any;
  telemetryStationLog: any;
  telemetryErrorLog: any;
}

class EVASimulation {
  private readonly models: SimulationModels;
  simTimer: ReturnType<typeof setTimeout> | undefined = undefined;
  simStateID!: number;
  simControlID!: number;
  simFailureID!: number;
  holdID = null;
  lastTimestamp: number | null = null;
  session_log_id: string | null = null;
  private readonly room;
  // Data Objects
  simState: TelemetryData = INIT_TELEMETRY_DATA;
  simControls: any = {};
  simFailure: any = {};

  constructor(_models: SimulationModels, _room_id: any, _session_log_id: string | null) {
    this.models = _models;
    this.room = _room_id;
    this.session_log_id = _session_log_id;
    this.seedInstances();
  }

  private async seedInstances(): Promise<void> {
    // Seed the states on start
    await this.models.simulationState.update(INIT_TELEMETRY_DATA, {
      where: { [primaryKeyOf(this.models.simulationState)]: parseInt(this.room) },
    });

    await this.models.simulationFailure.update(simFailureSeed, {
      where: { [primaryKeyOf(this.models.simulationFailure)]: parseInt(this.room) },
    });
    console.log('Seed Completed');
  }

  public async start(roomID: number, sessionLogID: number): Promise<void | boolean> {
    /**
     * Update the session log id for the current room
     */
    async function updateSessionLogID(): Promise<void> {
      return new Promise((resolve, reject) => {
        this.models.room
          .update({ session_log_id: sessionLogID }, { where: { [primaryKeyOf(this.models.room)]: roomID } })
          .then(() => {
            resolve();
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }

    /**
     * Fetch the existing simulation state from the backend and set the current simulation state
     */
    async function fetchSimulationState(): Promise<void> {
      return new Promise((resolve, reject) => {
        this.models.simulationState
          .findAll({ where: { [primaryKeyOf(this.models.simulationState)]: roomID } })
          // TODO: Set type to model of the simulationState
          .then((data: any) => {
            this.simState = data[0].dataValues;
            resolve();
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }

    /**
     * Fetch the existing simulation failures from the backend and set the current simulation failures
     */
    async function fetchSimulationFailures(): Promise<void> {
      return new Promise((resolve, reject) => {
        this.models.simulationFailure
          .findAll({ where: { [primaryKeyOf(this.models.simulationFailure)]: roomID } })
          .then((data: any) => {
            this.simFailure = data[0].dataValues;
            resolve();
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }

    /**
     * Create a telemetry session log for the current room
     */
    async function createTelemetrySessionLog(): Promise<void> {
      return new Promise((resolve, reject) => {
        this.models.telemetrySessionLog
          .create({
            session_log_id: sessionLogID,
            room_id: roomID,
            start_time: Date.now(),
          })
          .then(() => {
            resolve();
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }

    this.simState = INIT_TELEMETRY_DATA; // Seed the simulation state to default
    this.simControls = {};
    this.simFailure = {};

    if (VERBOSE) {
      console.log('Starting Sim');
    }
    // await updateSessionLogID(); // TODO Delete this line and function if not needed
    await fetchSimulationState();
    // Simulation isn't running. No further action is required
    if (this.simState.is_running) {
      return false;
    }
    await fetchSimulationFailures();
    await createTelemetrySessionLog();

    this.simStateID = Number.parseInt(this.simState[primaryKeyOf(this.models.simulationState)] as string);
    this.simFailureID = this.simFailure[primaryKeyOf(this.models.simulationFailure)];

    if (VERBOSE) {
      console.log('--------------Simulation Starting--------------');
    }
    this.lastTimestamp = Date.now();
    this.simTimer = setInterval(() => {
      this.step();
    }, process.env.SIM_STEP_TIME as number | undefined);
  }
}

class EVASimulation {
  isPaused(): boolean {
    return this.simTimer == null;
  }

  async pause(): Promise<void> {
    if (!this.simState.is_running) {
      throw new Error('Cannot pause: simulation is not running or it is running and is already paused');
    }
    console.log('--------------Simulation Paused-------------');

    clearInterval(this.simTimer);
    this.simTimer = undefined;
    this.lastTimestamp = null;

    await this.models.simulationState.update(
      { is_paused: true },
      {
        where: { [primaryKeyOf(this.models.simulationState)]: this.simStateID },
      }
    );
  }

  async unpause(): Promise<void> {
    if (!this.simState.is_running) {
      throw new Error('Cannot unpause: simulation is not running or it is running and is not paused');
    }

    console.log('--------------Simulation Resumed-------------');
    this.lastTimestamp = Date.now();
    this.simTimer = setInterval(() => {
      this.step();
    }, process.env.SIM_STEP_TIME as number | undefined);

    await this.models.simulationState.update(
      { is_paused: false },
      {
        where: { [primaryKeyOf(this.models.simulationState)]: this.simStateID },
      }
    );
  }

  async stop(): Promise<void> {
    if (!this.simState.is_running) {
      throw new Error('Cannot stop: simulation is not running');
    }
    // this.simStateID = null
    // this.controlID = null
    // Update the room's session id to null, since the session has ended
    await this.models.room.update({ session_log_id: '' }, { where: { [primaryKeyOf(this.models.room)]: this.room } });
    // Set the session's end time to now
    await this.models.telemetrySessionLog.update(
      { end_time: Date.now() },
      { where: { [primaryKeyOf(this.models.telemetrySessionLog)]: this.session_log_id } }
    );
    clearInterval(this.simTimer);
    this.simTimer = undefined;
    this.lastTimestamp = null;
    console.log('--------------Simulation Stopped-------------');

    // Reseed here
    this.seedInstances();
  }

  async getState(): Promise<any> {
    const simState = await this.models.simulationState.findByPk(this.simStateID);
    // await simulationState.findById(simStateID).exec()
    return simState;
  }
  async getControls(): Promise<any> {
    const controls = await this.models.simulationControl.findByPk(this.simControlID);
    //await SimulationControl.findById(controlID).exec()
    return controls;
  }

  async getFailure(): Promise<any> {
    const failure = await this.models.simulationFailure.findByPk(this.simFailureID);
    //await simulationFailure.findById(failureID).exec()
    return failure;
  }

  async setFailure(newFailure: any): Promise<any> {
    const failure = await this.models.simulationFailure.update(newFailure, {
      where: {
        [primaryKeyOf(this.models.simulationFailure)]: this.simFailureID,
      },
    });

    // Update Failure Object
    await this.models.simulationFailure
      .findAll({ where: { [primaryKeyOf(this.models.simulationFailure)]: this.room } })
      .then((data: any) => {
        this.simFailure = data[0].dataValues;
      });

    return failure;
  }

  async setControls(newControls: any): Promise<any> {
    // const controls = await SimulationControl.findByIdAndUpdate(controlID, newControls, {new: true}).exec()
    const controls = await this.models.simulationControl.update(newControls, {
      where: {
        [primaryKeyOf(this.models.simulationControl)]: this.simControlID,
      },
    });

    // Update Controls Object
    // await models.simulationControl.findAll({ where: { room: this.room } }).then((data) => {
    //   this.simControls = data[0].dataValues;
    // });

    return controls;
  }

  async step(): Promise<void> {
    console.log(`StateID: ${this.simStateID}, ControlID: ${this.simControlID}, FailureID: ${this.simFailureID}`);
    try {
      // const simState = await simulationState.findById(this.simStateID).exec()
      // const controls = await simulationControl.findById(this.controlID).exec()
      const now = Date.now();
      const dt = now - (this.lastTimestamp || 0);
      this.lastTimestamp = now;
      // Get all simulation failures (new data) and udpate the simFailure object
      this.simStateID = this.simFailureID;

      const failureData = await this.models.simulationFailure.findAll({
        where: { [primaryKeyOf(this.models.simulationFailure)]: this.simFailureID },
      });
      console.log('stepping...');
      const newSimFailure = failureData[0].dataValues;
      this.simFailure = { ...this.simFailure, ...newSimFailure };
      // this.updateTelemetryErrorLogs();
      this.updateTelemetryStation();
      const newSimState: TelemetryData = evaTelemetry.simulationStep(
        dt,
        this.simControls,
        this.simFailure,
        this.simState
      );
      Object.assign(this.simState, newSimState);
      // await simState.save()
      await this.models.simulationState
        .update(this.simState, {
          where: {
            [primaryKeyOf(this.models.simulationState)]: this.simStateID,
          },
        })
        .then(() => {
          console.log('Updated');
        });
    } catch (error: any) {
      console.error('Caught failed error');
      console.error(error.toString());
    }
  }

  updateTelemetryErrorLogs(): void {
    const failureKeys = ['o2_error', 'pump_error', 'fan_error', 'battery_error'];
    const updatedErrors: any = {};
    // Loop through the keys to check for new error state changes
    failureKeys.forEach((key) => {
      // If the error is thrown, but the id is not set, set it.
      const error_id = this.simFailure[key + '_id'];
      if (this.simFailure[key] === true && (error_id === null || error_id === undefined || error_id === '')) {
        const errorID = uuidv4();
        // Set the error id for the current simulation
        this.simFailure[key + '_id'] = errorID;
        // Create log of the error in the DB (telemetryErrorLog table)
        this.models.telemetryErrorLog.create({
          error_log_id: errorID,
          session_log_id: this.session_log_id,
          room_id: this.room,
          error_type: key,
          start_time: new Date(),
        });
        // If the error fixed, set the end time and send the log to the DB
      } else if (this.simFailure[key] === false && error_id !== null && error_id !== undefined && error_id !== '') {
        // Send log to logs table in DB
        this.models.telemetryErrorLog.update(
          {
            end_time: Date.now(),
            resolved: true,
          },
          {
            where: {
              [primaryKeyOf(this.models.telemetryErrorLog)]: this.simFailure[key + '_id'],
            },
          }
        );
        // Reset the error id
        this.simFailure[key + '_id'] = null;
      }
      // Add the new value to the error object to be updated
      updatedErrors[key + '_id'] = this.simFailure[key + '_id'];
    });
    // Update the simulation failure table with the new error ids

    this.models.simulationFailure.update(updatedErrors, {
      where: {
        [primaryKeyOf(this.models.simulationFailure)]: this.room,
      },
    });
  }

  async updateTelemetryStation(): Promise<void> {
    // TODO: This will have a bug of the station only being logged when the telemetry simulation is running
    // TODO: Edge case when one room's TSS stopped, but is still assigned to a room (maybe, or does it auto-unassign)
    // TODO: Edge case when one room's station is still assigned when the TSS stops -- this will cause the station in logs to never be completed
    const roomData = await this.models.room.findOne({ where: { [primaryKeyOf(this.models.room)]: this.room } });
    const room = roomData?.dataValues;
    console.log(room);
    // If the room's station name is different than the current station name, it means a new station has been assigned to this room
    if (this.station_name !== room.station_name) {
      // If the previous station's id is not null, then we should end the previous station's log
      if (this.station_log_id !== null && this.station_log_id !== undefined && this.station_log_id !== '') {
        // End the previous station's log
        this.models.telemetryStationLog.update(
          {
            end_time: Date.now(),
            completed: true,
          },
          {
            where: {
              [primaryKeyOf(this.models.telemetryStationLog)]: this.station_log_id,
            },
          }
        );
      }
      // If the room was assigned to a new station, we want to create a new station log
      if (room.station_name !== undefined && room.station_name !== null && room.station_name !== '') {
        this.station_log_id = uuidv4();
        this.models.telemetryStationLog.create({
          station_log_id: this.station_log_id,
          session_log_id: this.session_log_id,
          room_id: this.room,
          station_name: room.station_name,
          start_time: Date.now(),
        });
        // Update the room's station id with the new id
        this.models.room.update(
          {
            station_log_id: this.station_log_id,
          },
          {
            where: {
              [primaryKeyOf(this.models.room)]: this.room,
            },
          }
        );
      }
    }
    // Update the current instances values
    this.station_name = room.station_name;
    this.station_log_id = room.station_log_id;
  }
}

export default EVASimulation;
