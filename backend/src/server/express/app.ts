import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import * as routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routeDictionary = {
  auth: routes.auth,
  roles: routes.role,
  rooms: routes.room,
  users: routes.users,
  simulationControl: routes.simulationControl,
  simulationState: routes.simulationState,
  simulationFailure: routes.simulationFailure,
  uia: routes.uia,
  telemetrySessionLog: routes.telemetrySessionLog,
  telemetryStationLog: routes.telemetryStationLog,
};

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// We create a wrapper to workaround async errors not being transmitted correctly.
function makeHandlerAwareOfAsyncErrors(handler: (arg0: any, arg1: any) => any): any {
  return async function (req: any, res: any, next: (arg0: unknown) => void) {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
}

console.log(__dirname);

app.use('/', express.static(`${__dirname}/public/SUITS`));

app.get('/conntest', (req: any, res: any) => {
  res.status(200).send({ ok: true, time: new Date() });
});

// We define the standard REST APIs for each route (if they exist).
for (const [routeName, routeController] of Object.entries(routeDictionary)) {
  // Auth Stuff
  if ('registerUser' in routeController) {
    app.post(`/api/${routeName}/register`, makeHandlerAwareOfAsyncErrors(routeController.registerUser));
  }

  if ('findUser' in routeController) {
    app.post(`/api/${routeName}/finduser`, makeHandlerAwareOfAsyncErrors(routeController.findUser));
  }
  if ('assignmentLookup' in routeController) {
    app.post(`/api/${routeName}/assignment`, makeHandlerAwareOfAsyncErrors(routeController.assignmentLookup));
  }
  if ('assignmentRelease' in routeController) {
    app.post(`/api/${routeName}/assignmentrelease`, makeHandlerAwareOfAsyncErrors(routeController.assignmentRelease));
  }

  // Simulation Stuff
  if ('commandSim' in routeController) {
    app.get(`/api/${routeName}/sim/:room/:event`, makeHandlerAwareOfAsyncErrors(routeController.commandSim));
  }

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

  if ('getAll' in routeController) {
    app.get(`/api/${routeName}`, makeHandlerAwareOfAsyncErrors(routeController.getAll));
  }
  if ('getById' in routeController) {
    app.get(`/api/${routeName}/:id`, makeHandlerAwareOfAsyncErrors(routeController.getById));
  }
  if ('getByName' in routeController) {
    app.get(`/api/${routeName}/user/:username`, makeHandlerAwareOfAsyncErrors(routeController.getByName));
  }

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
}

export default app;
