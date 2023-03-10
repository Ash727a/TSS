import { v4 as uuidv4 } from 'uuid';

import sequelize from '../database/index.js';
import simControlSeed from './seed/simcontrol.js';
import simFailureSeed from './seed/simfailure.js';
import simStateSeed from './seed/simstate.js';
import evaTelemetry from './telemetry/eva_telemetry.js';

const models = sequelize.models;

// const { default: simControlSeed } = await import('./seed/simcontrol.json', {
//   assert: {
//     type: 'json',
//   },
// });

class EVASimulation {
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

  constructor(_room_id: any, _session_log_id: string | null) {
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
    await models.simulationState.update(simStateSeed, {
      where: { id: parseInt(this.room) },
    });
    // await models.simulationControl.update(simControlSeed, {
    //   where: { room: parseInt(this.room) },
    // });
    await models.simulationFailure.update(simFailureSeed, {
      where: { id: parseInt(this.room) },
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
    await models.room.update({ session_log_id: sessionLogID }, { where: { id: roomid } });
    // TODO

    await models.simulationState.findAll({ where: { id: roomid } }).then((data) => {
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

    await models.simulationFailure.findAll({ where: { room: roomid } }).then((data) => {
      this.simFailure = data[0].dataValues;
    });

    await models.telemetrySessionLog.create({ session_log_id: sessionLogID, room_id: roomid, start_time: Date.now() });

    this.simStateID = this.simState.id;
    // this.simControlID = this.simControls.id;
    this.simFailureID = this.simFailure.id;

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

    await models.simulationState.update(
      { is_paused: true },
      {
        where: { id: this.simStateID },
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

    await models.simulationState.update(
      { is_paused: false },
      {
        where: { id: this.simStateID },
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
    await models.room.update({ session_log_id: '' }, { where: { id: this.room } });
    // Set the session's end time to now
    await models.telemetrySessionLog.update(
      { end_time: Date.now() },
      { where: { session_log_id: this.session_log_id } }
    );
    clearInterval(this.simTimer);
    this.simTimer = undefined;
    this.lastTimestamp = null;
    console.log('--------------Simulation Stopped-------------');

    // Reseed here
    this.seedInstances();
  }

  async getState(): Promise<any> {
    const simState = await models.simulationState.findByPk(this.simStateID);
    // await simulationState.findById(simStateID).exec()
    return simState;
  }
  async getControls(): Promise<any> {
    const controls = await models.SimulationControl.findByPk(this.simControlID);
    //await SimulationControl.findById(controlID).exec()
    return controls;
  }

  async getFailure(): Promise<any> {
    const failure = await models.simulationFailure.findByPk(this.simFailureID);
    //await simulationFailure.findById(failureID).exec()
    return failure;
  }

  async setFailure(newFailure: any): Promise<any> {
    const failure = await models.simulationFailure.update(newFailure, {
      where: {
        id: this.simFailureID,
      },
    });

    // Update Failure Object
    await models.simulationFailure.findAll({ where: { room: this.room } }).then((data) => {
      this.simFailure = data[0].dataValues;
    });

    return failure;
  }

  async setControls(newControls: any): Promise<any> {
    // const controls = await SimulationControl.findByIdAndUpdate(controlID, newControls, {new: true}).exec()
    const controls = await models.simulationControl.update(newControls, {
      where: {
        id: this.simControlID,
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

      const failureData = await models.simulationFailure.findAll({ where: { room: this.simFailureID } });
      const newSimFailure = failureData[0].dataValues;
      this.simFailure = { ...this.simFailure, ...newSimFailure };
      // this.updateTelemetryErrorLogs();
      // this.updateTelemetryStation();
      const newSimState = evaTelemetry.simulationStep(dt, this.simControls, this.simFailure, this.simState);
      Object.assign(this.simState, newSimState);
      // await simState.save()
      await models.simulationState
        .update(this.simState, {
          where: {
            id: this.simStateID,
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
        models.telemetryErrorLog.create({
          error_log_id: errorID,
          session_log_id: this.session_log_id,
          room_id: this.room,
          error_type: key,
          start_time: new Date(),
        });
        // If the error fixed, set the end time and send the log to the DB
      } else if (this.simFailure[key] === false && error_id !== null && error_id !== undefined && error_id !== '') {
        // Send log to logs table in DB
        models.telemetryErrorLog.update(
          {
            end_time: Date.now(),
            resolved: true,
          },
          {
            where: {
              error_log_id: this.simFailure[key + '_id'],
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

    models.simulationFailure.update(updatedErrors, {
      where: {
        id: this.room,
      },
    });
  }

  async updateTelemetryStation(): Promise<void> {
    // TODO: This will have a bug of the station only being logged when the telemetry simulation is running
    // TODO: Edge case when one room's TSS stopped, but is still assigned to a room (maybe, or does it auto-unassign)
    // TODO: Edge case when one room's station is still assigned when the TSS stops -- this will cause the station in logs to never be completed
    const roomData = await models.room.findOne({ where: { id: this.room } });
    const room = roomData?.dataValues;
    // If the room's station name is different than the current station name, it means a new station has been assigned to this room
    if (this.station_name !== room.station_name) {
      // If the previous station's id is not null, then we should end the previous station's log
      if (this.station_id !== null && this.station_id !== undefined && this.station_id !== '') {
        // End the previous station's log
        models.telemetryStationLog.update(
          {
            end_time: Date.now(),
            completed: true,
          },
          {
            where: {
              station_log_id: this.station_id,
            },
          }
        );
      }
      // If the room was assigned to a new station, we want to create a new station log
      if (room.station_name !== undefined && room.station_name !== null && room.station_name !== '') {
        this.station_id = uuidv4();
        models.telemetryStationLog.create({
          id: this.station_id,
          session_log_id: this.session_log_id,
          room_id: this.room,
          station_name: room.station_name,
          start_time: Date.now(),
        });
        // Update the room's station id with the new id
        models.room.update(
          {
            station_id: this.station_id,
          },
          {
            where: {
              station_log_id: this.room,
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
