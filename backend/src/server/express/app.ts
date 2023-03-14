import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import HasRoomID from './routes/HasRoomID.interface.js';
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
    this.app.use('/', express.static(`${__dirname}/public/SUITS`));
    this.app.get('/conntest', (req: any, res: any) => {
      res.status(200).send({ ok: true, time: new Date() });
    });
    console.log('🚀 ~ file: app.ts:26 ~ ExpressApp ~ constructor ~ _models:', _models);
    this.initRoutes(_models);
  }

  private initRoutes(_models: any): void {
    console.log('ROOM', _models.room);
    const model = new routes.room(_models.room);
    const routeDictionary = {
      // auth: new routes.auth(_models.user, _models.visionKit, _models.hmd),
      // roles: new routes.role(_models.role),
      rooms: model,
      // users: new routes.users(_models.user),
      // simulationControl: new routes.simulationControl(_models.simulationControl),
      // simulationState: new routes.simulationState(_models.simulationState),
      // simulationFailure: new routes.simulationFailure(_models.simulationFailure),
      // uia: new routes.uia(_models.uia),
      // telemetrySessionLog: new routes.telemetrySessionLog(_models.telemetrySessionLog),
      // telemetryStationLog: new routes.telemetryStationLog(_models.telemetryStationLog),
      // telemetryErrorLog: new routes.telemetryErrorLog(_models.telemetryErrorLog),
    };
    this.app.get(
      `/api/rooms`,
      this.makeHandlerAwareOfAsyncErrors(() => model.getById)
    );

    // // We define the standard REST APIs for each route (if they exist).
    // for (const [routeName, routeController] of Object.entries(routeDictionary)) {
    //   console.log(`Initializing route: ${routeName}...`, routeController, routeController.getModel());
    //   // break;

    //   // If it's a ModelRoute, then we can define the standard REST APIs.
    //   if (routeController instanceof ModelRoute) {
    //     this.app.get(`/api/${routeName}`, routeController.getAll);
    //     // this.app.get(`/api/${routeName}/:id`, this.makeHandlerAwareOfAsyncErrors(routeController.getById));
    //     // this.app.post(`/api/${routeName}`, this.makeHandlerAwareOfAsyncErrors(routeController.create));
    //     // this.app.put(`/api/${routeName}/:id`, this.makeHandlerAwareOfAsyncErrors(routeController.update));
    //     // this.app.delete(`/api/${routeName}/:id`, this.makeHandlerAwareOfAsyncErrors(routeController.remove));
    //     // this.app.get(`/api/${routeName}`, this.makeHandlerAwareOfAsyncErrors(routeController.getAll));
    //     // this.app.get(`/api/${routeName}/:id`, this.makeHandlerAwareOfAsyncErrors(routeController.getById));
    //     // this.app.post(`/api/${routeName}`, this.makeHandlerAwareOfAsyncErrors(routeController.create));
    //     // this.app.put(`/api/${routeName}/:id`, this.makeHandlerAwareOfAsyncErrors(routeController.update));
    //     // this.app.delete(`/api/${routeName}/:id`, this.makeHandlerAwareOfAsyncErrors(routeController.remove));
    //   }

    //   // Check if the getByRoomID method exists in this routeController. If so, we define its endpoint.
    //   // if (routeController.getMethods().includes('getByRoomID')) {
    //   //   const hasRoomIDController = routeController as HasRoomID;
    //   //   this.app.get(`/api/${routeName}/room/:id`, this.makeHandlerAwareOfAsyncErrors(hasRoomIDController.getByRoomID));
    //   // }

    //   // If it's an instance of auth, we define its endpoints.
    //   if (routeController instanceof routes.auth) {
    //     this.app.post(`/api/${routeName}/register`, this.makeHandlerAwareOfAsyncErrors(routeController.registerUser));
    //     this.app.post(`/api/${routeName}/finduser`, this.makeHandlerAwareOfAsyncErrors(routeController.findUser));
    //     this.app.post(
    //       `/api/${routeName}/assignment`,
    //       this.makeHandlerAwareOfAsyncErrors(routeController.assignmentLookup)
    //     );
    //     this.app.post(
    //       `/api/${routeName}/assignmentrelease`,
    //       this.makeHandlerAwareOfAsyncErrors(routeController.assignmentRelease)
    //     );
    //   }

    //   // If it's an instance of users, we define its endpoints.
    //   if (routeController instanceof routes.users) {
    //     this.app.put('/api/updateuia', this.makeHandlerAwareOfAsyncErrors(routeController.updateUIA));
    //   }

    //   // If it's an instance of room, we define its endpoints.
    //   if (routeController instanceof routes.room) {
    //     this.app.get(
    //       `/api/${routeName}/station/:station_name`,
    //       this.makeHandlerAwareOfAsyncErrors(routeController.getRoomByStationName)
    //     );
    //   }

    //   // If it's an instance of simulationControl, we define its endpoints.
    //   if (routeController instanceof routes.simulationControl) {
    //     this.app.get(
    //       `/api/${routeName}/room/:room/:event`,
    //       this.makeHandlerAwareOfAsyncErrors(routeController.commandSim)
    //     );
    //     this.app.get(
    //       `/api/${routeName}/room/:room/:control`,
    //       this.makeHandlerAwareOfAsyncErrors(routeController.controlSim)
    //     );
    //     this.app.get(
    //       `/api/${routeName}/room/:room/:failure`,
    //       this.makeHandlerAwareOfAsyncErrors(routeController.failureSim)
    //     );
    //   }

    // }
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
