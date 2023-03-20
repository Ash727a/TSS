import { v4 as uuidv4 } from 'uuid';

import { primaryKeyOf } from '../helpers.js';
import simControlSeed from './seed/simcontrol.js';
import simFailureSeed from './seed/simfailure.js';
import simStateSeed from './seed/simstate.js';
import evaTelemetry from './telemetry/eva_telemetry.js';

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
  models: SimulationModels;
  simTimer: ReturnType<typeof setTimeout> | undefined = undefined;
  simStateID: any = null;
  simControlID: any = null;
  simFailureID: any = null;
  holdID = null;
  lastTimestamp: number | null = null;
  session_log_id: string | null = null;
  room;

  // Data Objects
  simState: any = {};
  simControls: any = {};
  simFailure: any = {};

  station_id: string | null | undefined;
  station_name: any;

  constructor(_models: SimulationModels, _room_id: any, _session_log_id: string | null) {
    this.models = _models;
    this.room = _room_id;
    this.session_log_id = _session_log_id;
    this.seedInstances();
  }

  async seedInstances(): Promise<void> {
    // Get the instances for the room
    // const state = await models.simulationState.findOne({ where: { id: parseInt(this.room) } });
    // const control = await models.simulationControl.findOne({ where: { room: parseInt(this.room) } });
    // const failure = await models.simulationFailure.findOne({ where: { room: parseInt(this.room) } });
    // Seed the states on start

    await this.models.simulationState.update(simStateSeed, {
      where: { [primaryKeyOf(this.models.simulationState)]: parseInt(this.room) },
    });

    await this.models.simulationFailure.update(simFailureSeed, {
      where: { [primaryKeyOf(this.models.simulationFailure)]: parseInt(this.room) },
    });
    console.log('Seed Completed');
  }

  // is_running(): boolean {
  //   return this.simStateID !== null && this.simControlID !== null && this.simFailureID !== null;
  // }

  async start(roomid: any, sessionLogID: any): Promise<void | boolean> {
    console.log('Starting Sim');
    this.simState = {};
    this.simControls = {};
    this.simFailure = {};

    // The sim started. Update the session id for the current room
    await this.models.room.update(
      { session_log_id: sessionLogID },
      { where: { [primaryKeyOf(this.models.room)]: roomid } }
    );
    // TODO

    await this.models.simulationState
      .findAll({ where: { [primaryKeyOf(this.models.simulationState)]: roomid } })
      .then((data: any) => {
        this.simState = data[0].dataValues;
      });

    if (this.simState.is_running) {
      return false;
    }
    // Update is_running
    this.simState.is_running = true;

    // await models.simulationControl.findAll({ where: { room: roomid } }).then((data) => {
    //   // console.log(data);
    //   this.simControls = data[0].dataValues;
    // });

    await this.models.simulationFailure
      .findAll({ where: { [primaryKeyOf(this.models.simulationFailure)]: roomid } })
      .then((data: any) => {
        this.simFailure = data[0].dataValues;
      });

    await this.models.telemetrySessionLog.create({
      session_log_id: sessionLogID,
      room_id: roomid,
      start_time: Date.now(),
    });

    this.simStateID = this.simState[primaryKeyOf(this.models.simulationState)];
    // this.simControlID = this.simControls[primaryKeyOf(this.models.simulationControl)]];
    this.simFailureID = this.simFailure[primaryKeyOf(this.models.simulationFailure)];

    console.log('--------------Simulation Starting--------------');
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
      const newSimFailure = failureData[0].dataValues;
      this.simFailure = { ...this.simFailure, ...newSimFailure };
      // this.updateTelemetryErrorLogs();
      // this.updateTelemetryStation();
      const newSimState = evaTelemetry.simulationStep(dt, this.simControls, this.simFailure, this.simState);
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
    // If the room's station name is different than the current station name, it means a new station has been assigned to this room
    if (this.station_name !== room.station_name) {
      // If the previous station's id is not null, then we should end the previous station's log
      if (this.station_id !== null && this.station_id !== undefined && this.station_id !== '') {
        // End the previous station's log
        this.models.telemetryStationLog.update(
          {
            end_time: Date.now(),
            completed: true,
          },
          {
            where: {
              [primaryKeyOf(this.models.telemetryStationLog)]: this.station_id,
            },
          }
        );
      }
      // If the room was assigned to a new station, we want to create a new station log
      if (room.station_name !== undefined && room.station_name !== null && room.station_name !== '') {
        this.station_id = uuidv4();
        this.models.telemetryStationLog.create({
          id: this.station_id,
          session_log_id: this.session_log_id,
          room_id: this.room,
          station_name: room.station_name,
          start_time: Date.now(),
        });
        // Update the room's station id with the new id
        this.models.room.update(
          {
            station_id: this.station_id,
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
    this.station_id = room.station_id;
  }
}

export default EVASimulation;