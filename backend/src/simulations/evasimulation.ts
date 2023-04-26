import { v4 as uuidv4 } from 'uuid';

import { primaryKeyOf } from '../helpers.js';
import { INIT_TELEMETRY_DATA, TelemetryData } from '../interfaces.js';
import simFailureSeed from './seed/simfailure.js';
import evaTelemetry from './telemetry/eva_telemetry.js';
import { VERBOSE } from '../config.js';

interface SimulationModels {
  simulationState: any;
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
  // holdID = null;
  lastTimestamp: number | null = null;
  session_log_id: string | null = null;
  private readonly room;
  // Data Objects
  simState: TelemetryData = INIT_TELEMETRY_DATA;
  simFailure: any = {};

  station_log_id: string | null | undefined;
  station_name = '';

  constructor(_models: SimulationModels, _room_id: any, _session_log_id: string | null, _restore_flag: boolean) {
    this.models = _models;
    this.room = _room_id;
    this.session_log_id = _session_log_id;
    // If the restore flag is true, it is initializing a sim that is being restored, so don't seed the database row
    if (!_restore_flag) {
      this.seedInstances();
    }
  }

  private async seedInstances(): Promise<void> {
    // Seed the simulation state
    await this.models.simulationState.update(INIT_TELEMETRY_DATA, {
      where: { [primaryKeyOf(this.models.simulationState)]: parseInt(this.room) },
    });

    await this.models.simulationFailure.update(simFailureSeed, {
      where: { [primaryKeyOf(this.models.simulationFailure)]: parseInt(this.room) },
    });
    if (VERBOSE) console.log('Seed Completed');
  }

  async start(roomID: any, sessionLogID: any): Promise<void | boolean> {
    if (VERBOSE) console.log('Starting Sim');
    this.simState = INIT_TELEMETRY_DATA; // Clear data
    this.simFailure = {};

    // Assign the UUIDV4 session log ID to the room
    await this.models.room.update(
      { session_log_id: sessionLogID },
      { where: { [primaryKeyOf(this.models.room)]: roomID } }
    );

    // Fetch, then set the simulation state to the current EVASimulation instance
    await this.models.simulationState
      .findAll({ where: { [primaryKeyOf(this.models.simulationState)]: roomID } })
      .then((data: any) => {
        this.simState = data[0].dataValues;
      });

    // Check if the simulation is already running. This should never happen, but just in case
    if (this.simState.is_running) {
      throw new Error('Simulation is already running');
    }

    // Set the current instance to running
    this.simState.is_running = true;

    // Fetch, then set the simulation failures to the current EVASimulation instance
    await this.models.simulationFailure
      .findAll({ where: { [primaryKeyOf(this.models.simulationFailure)]: roomID } })
      .then((data: any) => {
        this.simFailure = data[0].dataValues;
      });

    // Create a new telemetry session log in the logs DB
    await this.models.telemetrySessionLog.create({
      session_log_id: sessionLogID,
      room_id: roomID,
      start_time: Date.now(),
    });

    // Set the state id
    this.simStateID = Number.parseInt(this.simState[primaryKeyOf(this.models.simulationState)] as string);

    if (VERBOSE) console.log('--------------Simulation Starting--------------');
    this.lastTimestamp = Date.now();
    this.simTimer = setInterval(() => {
      this.step();
    }, process.env.SIM_STEP_TIME as number | undefined);
  }

  isPaused(): boolean {
    return this.simTimer == null;
  }

  async pause(): Promise<void> {
    if (!this.simState.is_running) {
      throw new Error('Cannot pause: simulation is not running or it is running and is already paused');
    }
    if (VERBOSE) console.log('--------------Simulation Paused-------------');

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

  async resume(): Promise<void> {
    if (!this.simState.is_running) {
      throw new Error('Cannot resume: simulation is not running or it is running and is not paused');
    }

    if (VERBOSE) console.log('--------------Simulation Resumed-------------');
    this.lastTimestamp = Date.now();
    // Set the simState to not paused so that it will update the DB in the next step() call
    this.simState.is_paused = false;

    this.simTimer = setInterval(() => {
      this.step();
    }, process.env.SIM_STEP_TIME as number | undefined);
    this.printState();
  }

  async stop(): Promise<void> {
    if (!this.simState.is_running) {
      throw new Error('Cannot stop: simulation is not running');
    }
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
    if (VERBOSE) console.log('--------------Simulation Stopped-------------');

    // Reseed here
    this.seedInstances();
  }

  async getState(): Promise<any> {
    const simState = await this.models.simulationState.findByPk(this.simStateID);
    // await simulationState.findById(simStateID).exec()
    return simState;
  }

  async getFailure(): Promise<any> {
    const failure = await this.models.simulationFailure.findByPk(this.simStateID);
    //await simulationFailure.findById(failureID).exec()
    return failure;
  }

  async setFailure(newFailure: any): Promise<any> {
    const failure = await this.models.simulationFailure.update(newFailure, {
      where: {
        [primaryKeyOf(this.models.simulationFailure)]: this.simStateID,
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

  async step(): Promise<void> {
    if (VERBOSE) console.log(`StateID: ${this.simStateID}`);
    try {
      const now = Date.now();
      const dt = now - (this.lastTimestamp || 0);
      this.lastTimestamp = now;
      const failureData = await this.models.simulationFailure.findAll({
        where: { [primaryKeyOf(this.models.simulationFailure)]: this.simStateID },
      });
      const newSimFailure = failureData[0].dataValues;
      this.simFailure = { ...this.simFailure, ...newSimFailure };
      this.updateTelemetryErrorLogs();
      this.updateTelemetryStation();
      const newSimState: TelemetryData = evaTelemetry.simulationStep(dt, this.simFailure, this.simState);
      Object.assign(this.simState, newSimState);
      // await simState.save()
      await this.models.simulationState
        .update(this.simState, {
          where: {
            [primaryKeyOf(this.models.simulationState)]: this.simStateID,
          },
        })
        .then(() => {
          if (VERBOSE) console.log('Updated');
        });
    } catch (error: any) {
      console.error('Caught failed error');
      console.error(error.toString());
    }
    // this.printState();
  }

  async updateTelemetryErrorLogs(): Promise<void> {
    const failureKeys = ['o2_error', 'pump_error', 'fan_error', 'power_error'];
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
    // If the room's station name is different than the current station name, it means a new station has been assigned to this room
    if (this.station_name !== room.station_name) {
      // If the previous station's id is not null, then we should end the previous station's log
      if ([null, undefined, ''].includes(this.station_log_id) === false) {
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
      if ([null, undefined, ''].includes(this.station_name) === false) {
        this.station_log_id = uuidv4();
        this.models.telemetryStationLog.create({
          station_log_id: this.station_log_id,
          session_log_id: this.session_log_id,
          room_id: this.room,
          station_name: this.station_name,
          start_time: Date.now(),
        });
        // Update the room's station id with the new id and station name
        this.models.room.update(
          {
            station_name: this.station_name,
            station_log_id: this.station_log_id,
          },
          {
            where: {
              [primaryKeyOf(this.models.room)]: this.room,
            },
          }
        );
      } else {
        // Case for unassigning a station from a room
        this.models.room.update(
          {
            station_name: '',
            station_log_id: '',
          },
          {
            where: {
              [primaryKeyOf(this.models.room)]: this.room,
            },
          }
        );
      }
    } else {
      // Update the current instances values
      this.station_name = room.station_name;
      this.station_log_id = room.station_log_id;
    }
  }

  /**
   * Prints the current state of the simulation
   */
  private printState(): void {
    console.log('Current State:');
    console.log(this.simState);
    console.log('Current Failure:');
    console.log(this.simFailure);
    console.log('Current Station:');
    console.log(this.station_name, this.station_log_id, '\n');
  }
}

export default EVASimulation;
