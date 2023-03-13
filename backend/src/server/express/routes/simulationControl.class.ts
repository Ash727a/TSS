import { v4 as uuidv4 } from 'uuid';

import EVASimulation from '../../../simulations/evasimulation.js';
import ModelRoute from './ModelRoute.class.js';

class simulationControl extends ModelRoute {
  private sims: any = [];
  constructor(_model: any) {
    super(_model);
  }

  public async commandSim(
    req: { params: { room: any; event: any } },
    res: {
      status: (arg0: number) => {
        (): any;
        (): any;
        json: { (arg0: { ok: boolean; err?: string; event?: any }): void; (): any };
      };
    }
  ): Promise<void> {
    console.log(`Room: ${req.params.room} Event: ${req.params.event}`);
    if (req.params.event && req.params.room) {
      // Check if the sim already exists
      const existingSim: any = this.sims.find((x: any) => x.room === req.params.room);

      switch (req.params.event) {
        case 'start':
          {
            let simInst: any = {};
            const session_log_id = uuidv4();
            if (!existingSim) {
              simInst = {
                room: req.params.room,
                sim: new EVASimulation(req.params.room, session_log_id),
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
              console.log(simInst.room, simInst.sim.session_log_id);
              simInst.sim.start(simInst.room, simInst.sim.session_log_id);
            }, 1000);
          }
          break;
        case 'pause':
          if (existingSim) {
            existingSim.sim.pause();
          } else {
            res.status(400).json({ ok: false, err: 'Simulation must be started before it can be paused.' });
          }
          break;
        case 'unpause':
          if (existingSim) {
            existingSim.sim.unpause();
          } else {
            res.status(400).json({ ok: false, err: 'Simulation must be paused before it can be unpaused.' });
          }
          break;
        case 'stop':
          if (existingSim) {
            existingSim.sim.stop();
          } else {
            res.status(400).json({ ok: false, err: 'Simulation must be running or paused before it can be stopped.' });
          }
          break;
      }
    } else {
      res.status(400).json({ ok: false, err: 'A room and event are both required.' });
    }
    res.status(200).json({ ok: true, event: req.params.event });
  }

  public async controlSim(
    req: { params: { room: any; control: any } },
    res: {
      status: (arg0: number) => {
        (): any;
        (): any;
        json: { (arg0: { ok: boolean; err: string }): void; (): any };
        send: { (arg0: { ok: boolean; controls: any }): void; (): any };
      };
    }
  ): Promise<void> {
    const simInst = this.sims.find((x: any) => x.room === req.params.room);

    if (!simInst) {
      res.status(400).json({ ok: false, err: 'No sim found to command. Have you started the simulation?' });
      console.warn(`CTRL No Sim Found of ${this.sims.length} sims`);
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
    res.status(200).send({ ok: true, controls: simInst.controls });
  }

  public async failureSim(
    req: { params: { room: any; failure: any } },
    res: {
      status: (arg0: number) => {
        (): any;
        (): any;
        json: { (arg0: { ok: boolean; err: string }): void; (): any };
        send: { (arg0: { ok: boolean; failures: any }): void; (): any };
      };
    }
  ): Promise<void> {
    const simInst = this.sims.find((x: any) => x.room === req.params.room);

    if (!simInst) {
      res.status(400).json({ ok: false, err: 'No sim found to apply failures. Have you started the simulation?' });
      console.warn(`CTLFAILURE No Sim Found of ${this.sims.length} sims`);
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
    res.status(200).send({ ok: true, failures: simInst.failure });
  }
}

export default simulationControl;
