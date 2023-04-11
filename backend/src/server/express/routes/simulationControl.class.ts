import { v4 as uuidv4 } from 'uuid';

import { APIRequest, APIResult, SequelizeModel } from '../../../interfaces.js';
import EVASimulation from '../../../simulations/evasimulation.js';
import ModelRoute from './ModelRoute.class.js';

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
  controls: { [key: string]: boolean };
  failure: { [key: string]: boolean };
};
class simulationControl extends ModelRoute {
  private sims: SimulationInstance[] = [];
  private dependentModels: { [key: string]: SequelizeModel };

  constructor(_model: SequelizeModel, _dependentModels: { [key: string]: SequelizeModel }) {
    super(_model);
    this.dependentModels = _dependentModels;
  }

  public async commandSim(req: APIRequest, res: APIResult): Promise<void> {
    console.log(`Room: ${req.params.room} Event: ${req.params.event}`);
    if (req.params.event && req.params.room) {
      // Check if the sim already exists
      const existingSim: SimulationInstance | undefined = this.sims.find(
        (_sim: SimulationInstance) => _sim.room === req.params.room
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
                sim: new EVASimulation(simModels, req.params.room, session_log_id),
                controls: {
                  fan_switch: false,
                  suit_power: false,
                  o2_switch: false,
                  aux: false,
                  rca: false,
                  pump: false,
                },
                failure: {
                  o2_error: false,
                  pump_error: false,
                  power_error: false,
                  fan_error: false,
                },
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
          }
          break;
        case 'unpause':
          if (existingSim) {
            existingSim.sim.unpause();
          } else {
            res.status(400).send('Simulation must be paused before it can be unpaused.');
          }
          break;
        case 'stop':
          if (existingSim) {
            existingSim.sim.stop();
          } else {
            res.status(400).send('Simulation must be running or paused before it can be stopped.');
          }
          break;
      }
    } else {
      res.status(400).send('A room and event are both required.');
    }
    res.status(200).json(req.params.event);
  }

  public async controlSim(req: APIRequest, res: APIResult): Promise<void> {
    const simInst: SimulationInstance | undefined = this.sims.find(
      (_sim: SimulationInstance) => _sim.room === req.params.room
    );

    if (!simInst) {
      console.warn(`CTRL No Sim Found of ${this.sims.length} sims`);
      res.status(400).send('No sim found to command. Have you started the simulation?');
      return;
    }

    switch (req.params.control) {
      case 'fan_switch':
        simInst.controls.fan_switch = !simInst.controls.fan_switch;
        break;
      case 'suit_power':
        console.log(`Instance Room: ${simInst.room} `);
        simInst.controls.suit_power = !simInst.controls.suit_power;
        break;
      case 'o2_switch':
        simInst.controls.o2_switch = !simInst.controls.o2_switch;
        break;
      case 'aux':
        simInst.controls.aux = !simInst.controls.aux;
        break;
      case 'rca':
        simInst.controls.rca = !simInst.controls.rca;
        break;
      case 'pump':
        simInst.controls.pump = !simInst.controls.pump;
        break;
    }

    simInst.sim.setControls(simInst.controls);
    res.status(200).json(simInst.controls);
  }

  public async failureSim(req: APIRequest, res: APIResult): Promise<void> {
    const simInst: SimulationInstance | undefined = this.sims.find(
      (_sim: SimulationInstance) => _sim.room === req.params.room
    );

    if (!simInst) {
      console.warn(`CTLFAILURE No Sim Found of ${this.sims.length} sims`);
      res.status(400).send('No sim found to apply failures. Have you started the simulation?');
      return;
    }

    switch (req.params.failure) {
      case 'o2_error':
        simInst.failure.o2_error = !simInst.failure.o2_error;
        break;
      case 'pump_error':
        simInst.failure.pump_error = !simInst.failure.pump_error;
        break;
      case 'power_error':
        simInst.failure.power_error = !simInst.failure.power_error;
        break;
      case 'fan_error':
        simInst.failure.fan_error = !simInst.failure.fan_error;
        break;
    }

    simInst.sim.setFailure(simInst.failure);
    res.status(200).json(simInst.failure);
  }

  public async updateSimStation(req: APIRequest, res: APIResult): Promise<void> {
    const simInst: SimulationInstance | undefined = this.sims.find(
      (_sim: SimulationInstance) => _sim.room === req.params.room
    );

    if (!simInst) {
      console.warn(`UPDATE No Sim Found of ${this.sims.length} sims`);
      res.status(400).send('No sim found to update. Have you started the simulation?');
      return;
    }
    console.log('🚀 ~ file: simulationControl.class.ts:190 ~ simulationControl ~ updateSim ~ req:', req);
  }
}

export default simulationControl;
