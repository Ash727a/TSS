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
    const routeDictionary = {
      auth: new routes.auth(_models.user, _models.visionKit, _models.hmd),
      roles: new routes.role(_models.role),
      rooms: new routes.room(_models.room),
      users: new routes.users(_models.user),
      simulationControl: new routes.simulationControl(_models.simulationControl, {
        simulationState: _models.simulationState,
        simulationFailure: _models.simulationFailure,
        room: _models.room,
        telemetrySessionLog: _models.telemetrySessionLog,
        telemetryStationLog: _models.telemetryStationLog,
        telemetryErrorLog: _models.telemetryErrorLog,
      }),
      simulationState: new routes.simulationState(_models.simulationState),
      simulationFailure: new routes.simulationFailure(_models.simulationFailure),
      uia: new routes.uia(_models.uia),
      telemetrySessionLog: new routes.telemetrySessionLog(_models.telemetrySessionLog),
      telemetryStationLog: new routes.telemetryStationLog(_models.telemetryStationLog),
      telemetryErrorLog: new routes.telemetryErrorLog(_models.telemetryErrorLog),
    };

    // We define the standard REST APIs for each route (if they exist).
    for (const [routeName, routeController] of Object.entries(routeDictionary)) {
      // If it's a ModelRoute, then we can define the standard REST APIs.
      if (routeController instanceof ModelRoute) {
        this.app.get(
          `/api/${routeName}`,
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.getAll(req, res))
        );
        this.app.get(
          `/api/${routeName}/:id`,
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.getById(req, res))
        );
        this.app.post(
          `/api/${routeName}`,
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.create(req, res))
        );
        this.app.put(
          `/api/${routeName}/:id`,
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.update(req, res))
        );
        this.app.delete(
          `/api/${routeName}/:id`,
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.remove(req, res))
        );
        this.app.get(
          `/api/${routeName}`,
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.getAll(req, res))
        );
        this.app.get(
          `/api/${routeName}/:id`,
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.getById(req, res))
        );
        this.app.post(
          `/api/${routeName}`,
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.create(req, res))
        );
        this.app.put(
          `/api/${routeName}/:id`,
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.update(req, res))
        );
        this.app.delete(
          `/api/${routeName}/:id`,
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.remove(req, res))
        );
      }

      // Check if the getByRoomID method exists in this routeController. If so, we define its endpoint.
      if (routeController.getMethods().includes('getByRoomID')) {
        const hasRoomIDController = routeController as HasRoomID;
        this.app.get(
          `/api/${routeName}/room/:id`,
          this.makeHandlerAwareOfAsyncErrors((req, res) => hasRoomIDController.getByRoomID(req, res))
        );
      }

      // If it's an instance of auth, we define its endpoints.
      if (routeController instanceof routes.auth) {
        this.app.post(
          `/api/${routeName}/register`,
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.registerUser(req, res))
        );
        this.app.post(
          `/api/${routeName}/finduser`,
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.findUser(req, res))
        );
        this.app.post(
          `/api/${routeName}/assignment`,
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.assignmentLookup(req, res))
        );
        this.app.post(
          `/api/${routeName}/assignmentrelease`,
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.assignmentRelease(req, res))
        );
      }

      // If it's an instance of uia, we define its endpoints.
      if (routeController instanceof routes.uia) {
        this.app.put(
          '/api/updateuia',
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.updateUIA(req, res))
        );
      }

      // If it's an instance of room, we define its endpoints.
      if (routeController instanceof routes.room) {
        this.app.get(
          `/api/${routeName}/station/:station_name`,
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.getRoomByStationName(req, res))
        );
      }

      // If it's an instance of simulationControl, we define its endpoints.
      if (routeController instanceof routes.simulationControl) {
        this.app.get(
          `/api/${routeName}/sim/:room/:event`,
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.commandSim(req, res))
        );
        this.app.get(
          `/api/${routeName}/sim/:room/:control`,
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.controlSim(req, res))
        );
        this.app.get(
          `/api/${routeName}/sim/:room/:failure`,
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.failureSim(req, res))
        );
      }
    }
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
