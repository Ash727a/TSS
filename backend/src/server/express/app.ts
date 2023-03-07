import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

const routes = {
  auth: require('./routes/auth'),
  locations: require('./routes/location'),
  lsar: require('./routes/lsar'),
  roles: require('./routes/role'),
  rooms: require('./routes/room'),
  users: require('./routes/users'),
  simulationcontrol: require('./routes/simulationcontrol'),
  simulationstate: require('./routes/simulationstate'),
  simulationfailure: require('./routes/simulationfailure'),
  simulationstateuia: require('./routes/simulationstateuia'),
  simulationuia: require('./routes/simulationuia'),
  // telemetryerrorlog: require('./routes/telemetryerrorlog'),
  telemetrysessionlog: require('./routes/telemetrysessionlog'),
  telemetrystationlog: require('./routes/telemetrystationlog'),
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
for (const [routeName, routeController] of Object.entries(routes)) {
  // Auth Stuff
  if (routeController.registerUser) {
    app.post(`/api/${routeName}/register`, makeHandlerAwareOfAsyncErrors(routeController.registerUser));
  }

  if (routeController.findUser) {
    app.post(`/api/${routeName}/finduser`, makeHandlerAwareOfAsyncErrors(routeController.findUser));
  }
  if (routeController.assignmentLookup) {
    app.post(`/api/${routeName}/assignment`, makeHandlerAwareOfAsyncErrors(routeController.assignmentLookup));
  }
  if (routeController.assignmentRelease) {
    app.post(`/api/${routeName}/assignmentrelease`, makeHandlerAwareOfAsyncErrors(routeController.assignmentRelease));
  }

  // Simulation Stuff
  if (routeController.commandSim) {
    app.get(`/api/${routeName}/sim/:room/:event`, makeHandlerAwareOfAsyncErrors(routeController.commandSim));
  }

  if (routeController.controlSim) {
    app.get(`/api/${routeName}/simctl/:room/:control`, makeHandlerAwareOfAsyncErrors(routeController.controlSim));
  }

  if (routeController.failureSim) {
    app.get(`/api/${routeName}/simfail/:room/:failure`, makeHandlerAwareOfAsyncErrors(routeController.failureSim));
  }

  // Commander Stuff
  if (routeController.getAllRoomsWithUsers) {
    app.get(`/api/${routeName}/cmdr/getusers`, makeHandlerAwareOfAsyncErrors(routeController.getAllRoomsWithUsers));
  }
  // End Commander Stuff

  if (routeController.getAll) {
    app.get(`/api/${routeName}`, makeHandlerAwareOfAsyncErrors(routeController.getAll));
  }
  if (routeController.getById) {
    app.get(`/api/${routeName}/:id`, makeHandlerAwareOfAsyncErrors(routeController.getById));
  }
  if (routeController.getByName) {
    app.get(`/api/${routeName}/user/:username`, makeHandlerAwareOfAsyncErrors(routeController.getByName));
  }

  if (routeController.getByRoomId) {
    app.get(`/api/${routeName}/room/:room`, makeHandlerAwareOfAsyncErrors(routeController.getByRoomId));
  }

  if (routeController.getByUserId) {
    app.get(`/api/${routeName}/user/:user`, makeHandlerAwareOfAsyncErrors(routeController.getByUserId));
  }
  if (routeController.create) {
    app.post(`/api/${routeName}`, makeHandlerAwareOfAsyncErrors(routeController.create));
  }
  if (routeController.update) {
    app.put(`/api/${routeName}/:id`, makeHandlerAwareOfAsyncErrors(routeController.update));
  }
  if (routeController.remove) {
    app.delete(`/api/${routeName}/:id`, makeHandlerAwareOfAsyncErrors(routeController.remove));
  }

  // Room Stuff
  if (routeController.getRoomByStationName) {
    app.get(
      `/api/${routeName}/station/:stationName`,
      makeHandlerAwareOfAsyncErrors(routeController.getRoomByStationName)
    );
  }
}

export default app;
