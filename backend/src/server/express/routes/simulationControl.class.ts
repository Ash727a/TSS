import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { VERBOSE } from '../../../config.js';

import { APIRequest, APIResult, SequelizeModel } from '../../../interfaces.js';
import EVASimulation from '../../../simulations/evasimulation.js';
import ModelRoute from './ModelRoute.class.js';
import { primaryKeyOf } from '../../../helpers.js';

/** CLASS: simulationControl
 * @description: This class matches with the simulationControl model in the DB.
 * @extends ModelRoute
 * @param {SequelizeModel} _model - The model that is used for the route.
 * @param {SequelizeModel{}} _dependentModels - The dependent models that are used for the simulation.
 * @returns {simulationControl} - The simulationControl object.
 */

type SimulationInstance = {
  room: string;
  sim: EVASimulation;
};
class simulationControl extends ModelRoute {
  private sims: SimulationInstance[] = [];
  private dependentModels: { [key: string]: SequelizeModel };

  constructor(_model: SequelizeModel, _dependentModels: { [key: string]: SequelizeModel }) {
    super(_model);
    this.dependentModels = _dependentModels;
  }

  public async commandSim(req: APIRequest, res: APIResult): Promise<void> {
    if (req.params.event && req.params.room) {
      // Check if the sim already exists
      const existingSim: SimulationInstance | undefined = this.sims.find(
        (_sim: SimulationInstance) => req.params.room.toString() === _sim.room.toString()
      );
      switch (req.params.event) {
        case 'start':
          {
            let simInst: SimulationInstance;
            const session_log_id = uuidv4();
            const simModels = {
              simulationState: this.dependentModels.simulationState,
              simulationControl: this.dependentModels.simulationControl,
              simulationFailure: this.dependentModels.simulationFailure,
              room: this.dependentModels.room,
              telemetrySessionLog: this.dependentModels.telemetrySessionLog,
              telemetryStationLog: this.dependentModels.telemetryStationLog,
              telemetryErrorLog: this.dependentModels.telemetryErrorLog,
            };
            if (!existingSim) {
              simInst = {
                room: req.params.room,
                sim: new EVASimulation(simModels, req.params.room, session_log_id, false),
              };
            } else {
              // There is an existing simulation, but the session is different. Set the session_id to the new generated id
              existingSim.sim.session_log_id = session_log_id;
              simInst = existingSim;
            }
            // Attempt to start the sim.
            this.sims.push(simInst);
            // Start w/ 1sec delay
            setTimeout(() => {
              simInst.sim.start(simInst.room, simInst.sim.session_log_id);
            }, 1000);
          }
          break;
        case 'pause':
          if (existingSim) {
            existingSim.sim.pause();
          } else {
            res.status(400).send('Simulation must be started before it can be paused.');
            return;
          }
          break;
        case 'resume':
          if (existingSim) {
            existingSim.sim.resume();
          } else {
            res.status(400).send('Simulation must be paused before it can be resumed.');
            return;
          }
          break;
        case 'stop':
          if (existingSim) {
            existingSim.sim.stop();
          } else {
            res.status(400).send('Simulation must be running or paused before it can be stopped.');
            return;
          }
          break;
      }
    } else {
      res.status(400).send('A room and event are both required.');
      return;
    }
    res.status(200).json(req.params.event);
    return;
  }

  public async failureSim(req: APIRequest, res: APIResult): Promise<void> {
    const simInst: SimulationInstance | undefined = this.sims.find(
      (_sim: SimulationInstance) => req.params.room.toString() === _sim.room.toString()
    );

    if (!simInst) {
      console.warn(`CTLFAILURE No Sim Found of ${this.sims.length} sims`);
      res.status(400).send('No sim found to apply failures. Have you started the simulation?');
      return;
    }

    switch (req.params.failure) {
      case 'o2_error':
        simInst.sim.simFailure.o2_error = !simInst.sim.simFailure.o2_error;
        break;
      case 'pump_error':
        simInst.sim.simFailure.pump_error = !simInst.sim.simFailure.pump_error;
        break;
      case 'power_error':
        simInst.sim.simFailure.power_error = !simInst.sim.simFailure.power_error;
        break;
      case 'fan_error':
        simInst.sim.simFailure.fan_error = !simInst.sim.simFailure.fan_error;
        break;
    }

    simInst.sim.setFailure(simInst.sim.simFailure);
    res.status(200).json(simInst.sim.simFailure);
    return;
  }

  public async updateSimStation(req: APIRequest, res: APIResult): Promise<void> {
    const simInst: SimulationInstance | undefined = this.sims.find(
      (_sim: SimulationInstance) => req.params.room.toString() === _sim.room.toString()
    );

    if (!simInst) {
      console.warn(`UPDATE No Sim Found of ${this.sims.length} sims`);
      res.status(400).send('No sim found to update. Have you started the simulation?');
      return;
    }
    simInst.sim.station_name = req.body.station;
    res.status(200).json(simInst.sim.station_name);
    return;
  }

  public async restoreSimulations(req: APIRequest, res: APIResult): Promise<void> {
    const sims = await this.dependentModels.simulationState.findAll({
      where: {
        [Op.or]: [
          {
            is_running: 1,
          },
          {
            is_paused: 1,
          },
        ],
      },
    });
    sims.forEach(async (sim: any) => {
      const simModels = {
        simulationState: this.dependentModels.simulationState,
        simulationFailure: this.dependentModels.simulationFailure,
        room: this.dependentModels.room,
        telemetrySessionLog: this.dependentModels.telemetrySessionLog,
        telemetryStationLog: this.dependentModels.telemetryStationLog,
        telemetryErrorLog: this.dependentModels.telemetryErrorLog,
      };
      const _savedStateValues = sim.dataValues;
      let _session_log_id;
      let _station_log_id;
      let _station_name;
      let _errors = {};
      // TODO
      /**
       * - make sure extraneous instance vars are initialized correctly
       */
      const _room = await this.dependentModels.room.findOne({
        where: {
          [primaryKeyOf(this.dependentModels.room)]: _savedStateValues.room_id,
        },
      });
      if (_room) {
        _session_log_id = _room.dataValues.session_log_id;
        _station_log_id = _room.dataValues.station_log_id;
        _station_name = _room.dataValues.station_name;
        const failure_res = await this.dependentModels.simulationFailure.findOne({
          where: {
            [primaryKeyOf(this.dependentModels.simulationFailure)]: _savedStateValues.room_id,
          },
        });
        if (failure_res) {
          _errors = failure_res.dataValues;
        }
      } else {
        console.log(`Error: Room ${_savedStateValues.room_id}'s session_log_id was not found.}`);
      }

      const simInst: SimulationInstance = {
        room: _savedStateValues.room_id,
        sim: new EVASimulation(simModels, _savedStateValues.room_id, _session_log_id, true),
      };
      simInst.sim.station_log_id = _station_log_id;
      simInst.sim.station_name = _station_name;
      simInst.sim.simFailure = _errors;
      simInst.sim.simStateID = _savedStateValues.room_id;
      delete _savedStateValues.room_id;
      delete _savedStateValues.session_log_id;
      delete _savedStateValues.station_log_id;
      simInst.sim.simState = _savedStateValues;
      // Restore the previously running sim as paused
      if (simInst.sim.simState.is_running) {
        await simInst.sim.pause();
      }
      this.sims.push(simInst);
    });
    if (VERBOSE) {
      console.log(`Restored ${sims.length} simulations`);
    }
    res.status(200);
    return;
  }
}

export default simulationControl;
