import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { SequelizeModel } from '../../interfaces.js';
import HasRoomID from './routes/HasRoomID.interface.js';
import * as routes from './routes/index.js';
import ModelRoute from './routes/ModelRoute.class.js';

/** CLASS: ExpressApp
 * @description: The Express app that will be used to serve the API.
 * @param {{ [key: string]: SequelizeModel }} _models The models to use in the routes.
 */
class ExpressApp {
  public app: Express;
  constructor(_models: { [key: string]: SequelizeModel }) {
    const __filename: string = fileURLToPath(import.meta.url);
    const __dirname: string = path.dirname(__filename);
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use('/', express.static(`${__dirname}/public/SUITS`));
    this.app.get('/conntest', (req: any, res: any) => {
      res.status(200).send({ ok: true, time: new Date() });
    });
    this.initRoutes(_models);
  }

  private initRoutes(_models: { [key: string]: SequelizeModel }): void {
    const routeDictionary: object = {
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
      uia: new routes.uia(_models.uia, _models.room),
      rover: new routes.rover(_models.rover, _models.room),
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
        const hasRoomIDController: HasRoomID = routeController as HasRoomID;
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

      // If it's an instance of rover, we define its endpoints.
      if (routeController instanceof routes.rover) {
        this.app.put(
          '/api/updaterover',
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.updateRover(req, res))
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
          `/api/${routeName}/sim/:room/:failure`,
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.failureSim(req, res))
        );
        // For updating station
        this.app.put(
          `/api/${routeName}/sim/:room/station`,
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.updateSimStation(req, res))
        );
        // For restoring sims after disconnection
        this.app.put(
          `/api/${routeName}/sim/restore`,
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.restoreSimulations(req, res))
        );
      }

      // If it's an instance of telemetryStationLog, we define its endpoints.
      if (routeController instanceof routes.telemetryStationLog) {
        this.app.get(
          `/api/${routeName}/completed/:session_log_id`,
          this.makeHandlerAwareOfAsyncErrors((req, res) => routeController.findCompletedStations(req, res))
        );
      }
    }
  }

  // We create a wrapper to workaround async errors not being transmitted correctly.
  private makeHandlerAwareOfAsyncErrors(
    handler: (req: any, res: any) => Promise<void>
  ): (req: any, res: any, next: (arg0: unknown) => void) => Promise<void> {
    return async function (req: any, res: any, next: (arg0: unknown) => void) {
      try {
        await handler(req, res);
      } catch (error) {
        next(error);
      }
    };
  }
}

export default ExpressApp;
