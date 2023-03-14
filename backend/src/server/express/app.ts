import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import * as routes from './routes/index.js';
import ModelRoute from './routes/ModelRoute.class.js';

class ExpressApp {
  public app: any;
  constructor(_models: any) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
    console.log(__dirname);
    this.app.use('/', express.static(`${__dirname}/public/SUITS`));
    this.app.get('/conntest', (req: any, res: any) => {
      res.status(200).send({ ok: true, time: new Date() });
    });
    this.initRoutes(_models);
  }

  private initRoutes(_models: any): void {
    const routeDictionary = {
      // auth: new routes.auth(_models.user),
      roles: new routes.role(_models.role),
      rooms: new routes.room(_models.room),
      users: new routes.users(_models.user),
      simulationControl: new routes.simulationControl(_models.simulationControl),
      simulationState: new routes.simulationState(_models.simulationState),
      simulationFailure: new routes.simulationFailure(_models.simulationFailure),
      uia: new routes.uia(_models.uia),
      telemetrySessionLog: new routes.telemetrySessionLog(_models.telemetrySessionLog),
      telemetryStationLog: new routes.telemetryStationLog(_models.telemetryStationLog),
    };
    // We define the standard REST APIs for each route (if they exist).

    for (const [routeName, routeController] of Object.entries(routeDictionary)) {
      console.log(routeName, routeController.getModel());
      const model = routeController.getModel();
      // If it's a ModelRoute, then we can define the standard REST APIs.
      if (routeController instanceof ModelRoute) {
        this.app.get(`/api/${routeName}`, this.makeHandlerAwareOfAsyncErrors(model.getAll));
        this.app.get(`/api/${routeName}/:id`, this.makeHandlerAwareOfAsyncErrors(model.getById));
        this.app.post(`/api/${routeName}`, this.makeHandlerAwareOfAsyncErrors(model.create));
        this.app.put(`/api/${routeName}/:id`, this.makeHandlerAwareOfAsyncErrors(model.update));
        this.app.delete(`/api/${routeName}/:id`, this.makeHandlerAwareOfAsyncErrors(model.remove));
      }
      // If it's an instance of auth, we define it's endpoints.
      if (routeController instanceof routes.auth) {
        this.app.post(`/api/${routeName}/register`, this.makeHandlerAwareOfAsyncErrors(model.registerUser));
        this.app.post(`/api/${routeName}/finduser`, this.makeHandlerAwareOfAsyncErrors(model.findUser));
        this.app.post(
          `/api/${routeName}/assignment`,
          this.makeHandlerAwareOfAsyncErrors(routeController.assignmentLookup)
        );
        this.app.post(
          `/api/${routeName}/assignmentrelease`,
          this.makeHandlerAwareOfAsyncErrors(routeController.assignmentRelease)
        );
      }
      
      // Simulation Stuff
      /*
  if ('commandSim' in routeController) {
    app.get(`/api/${routeName}/sim/:room/:event`, makeHandlerAwareOfAsyncErrors(routeController.commandSim));
  }
  */
      // if ('controlSim' in routeController) {
      //   app.get(`/api/${routeName}/simctl/:room/:control`, makeHandlerAwareOfAsyncErrors(routeController.controlSim));
      // }
      // if ('failureSim' in routeController) {
      //   app.get(`/api/${routeName}/simfail/:room/:failure`, makeHandlerAwareOfAsyncErrors(routeController.failureSim));
      // }
      // Commander Stuff
      // if ('getAllRoomsWithUsers' in routeController) {
      //   app.get(`/api/${routeName}/cmdr/getusers`, makeHandlerAwareOfAsyncErrors(routeController.getAllRoomsWithUsers));
      // }
      // End Commander Stuff

      /* --
  if ('getByRoomId' in routeController) {
    app.get(`/api/${routeName}/room/:room`, makeHandlerAwareOfAsyncErrors(routeController.getByRoomId));
  }

  // if ('getByUserId' in routeController) {
  //   app.get(`/api/${routeName}/user/:user`, makeHandlerAwareOfAsyncErrors(routeController.getByUserId));
  // }
  if ('create' in routeController) {
    app.post(`/api/${routeName}`, makeHandlerAwareOfAsyncErrors(routeController.create));
  }
  if ('update' in routeController) {
    app.put(`/api/${routeName}/:id`, makeHandlerAwareOfAsyncErrors(routeController.update));
  }
  if ('remove' in routeController) {
    app.delete(`/api/${routeName}/:id`, makeHandlerAwareOfAsyncErrors(routeController.remove));
  }

  // Room Stuff
  if ('getRoomByStationName' in routeController) {
    app.get(
      `/api/${routeName}/station/:station_name`,
      makeHandlerAwareOfAsyncErrors(routeController.getRoomByStationName)
    );
  }
  */
    }
    /* --
    app.put('/api/updateuia', makeHandlerAwareOfAsyncErrors(routes.uia.updateUIA));
    */
  }

  // We create a wrapper to workaround async errors not being transmitted correctly.
  private makeHandlerAwareOfAsyncErrors(handler: (arg0: any, arg1: any) => any): any {
    return async function (req: any, res: any, next: (arg0: unknown) => void) {
      try {
        await handler(req, res);
      } catch (error) {
        next(error);
      }
    };
  }
}

// export default app;
export default ExpressApp;
