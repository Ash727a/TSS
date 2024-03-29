- __backend__
   - [README.md](README.md)
   - [env.d.ts](env.d.ts)
   - [node\_modules](node_modules)
   - [package\-lock.json](package-lock.json)
   - [package.json](package.json)
   - __src__
     - [config.ts](src/config.ts)
     - __database__
       - [Database.class.ts](src/database/Database.class.ts)
       - [index.ts](src/database/index.ts)
       - __local\-sqlite\-database__
         - __seed__
           - [extraSetup.ts](src/database/local-sqlite-database/seed/extraSetup.ts)
           - [helpers.ts](src/database/local-sqlite-database/seed/helpers.ts)
           - [setup.ts](src/database/local-sqlite-database/seed/setup.ts)
         - [suits.sqlite](src/database/local-sqlite-database/suits.sqlite)
         - [suits.sqlite.bkup](src/database/local-sqlite-database/suits.sqlite.bkup)
       - __models__
         - [index.ts](src/database/models/index.ts)
         - [interfaceHelpers.ts](src/database/models/interfaceHelpers.ts)
         - __logging__
           - [index.ts](src/database/models/logging/index.ts)
           - [telemetryErrorLog.model.ts](src/database/models/logging/telemetryErrorLog.model.ts)
           - [telemetrySessionLog.model.ts](src/database/models/logging/telemetrySessionLog.model.ts)
           - [telemetryStationLog.model.ts](src/database/models/logging/telemetryStationLog.model.ts)
         - [role.model.ts](src/database/models/role.model.ts)
         - [room.model.ts](src/database/models/room.model.ts)
         - __stations__
           - [geo.model.ts](src/database/models/stations/geo.model.ts)
           - [index.ts](src/database/models/stations/index.ts)
           - [uia.model.ts](src/database/models/stations/uia.model.ts)
         - __teams__
           - [hmd.model.ts](src/database/models/teams/hmd.model.ts)
           - [index.ts](src/database/models/teams/index.ts)
           - [user.model.ts](src/database/models/teams/user.model.ts)
           - __visionKitData__
             - [gpsMsg.model.ts](src/database/models/teams/visionKitData/gpsMsg.model.ts)
             - [imuMsg.model.ts](src/database/models/teams/visionKitData/imuMsg.model.ts)
             - [index.ts](src/database/models/teams/visionKitData/index.ts)
             - [visionKit.model.ts](src/database/models/teams/visionKitData/visionKit.model.ts)
         - __telemetry__
           - [index.ts](src/database/models/telemetry/index.ts)
           - [simulationFailure.model.ts](src/database/models/telemetry/simulationFailure.model.ts)
           - [simulationState.model.ts](src/database/models/telemetry/simulationState.model.ts)
     - [helpers.ts](src/helpers.ts)
     - [index.ts](src/index.ts)
     - [interfaces.ts](src/interfaces.ts)
     - __server__
       - __express__
         - [app.ts](src/server/express/app.ts)
         - [helpers.ts](src/server/express/helpers.ts)
         - __routes__
           - [HasRoomID.interface.ts](src/server/express/routes/HasRoomID.interface.ts)
           - [ModelRoute.class.ts](src/server/express/routes/ModelRoute.class.ts)
           - [Route.class.ts](src/server/express/routes/Route.class.ts)
           - [auth.class.ts](src/server/express/routes/auth.class.ts)
           - [index.ts](src/server/express/routes/index.ts)
           - [role.class.ts](src/server/express/routes/role.class.ts)
           - [room.class.ts](src/server/express/routes/room.class.ts)
           - [shared.ts](src/server/express/routes/shared.ts)
           - [simulationControl.class.ts](src/server/express/routes/simulationControl.class.ts)
           - [simulationFailure.class.ts](src/server/express/routes/simulationFailure.class.ts)
           - [simulationState.class.ts](src/server/express/routes/simulationState.class.ts)
           - [telemetryErrorLog.class.ts](src/server/express/routes/telemetryErrorLog.class.ts)
           - [telemetrySessionLog.class.ts](src/server/express/routes/telemetrySessionLog.class.ts)
           - [telemetryStationLog.class.ts](src/server/express/routes/telemetryStationLog.class.ts)
           - [uia.class.ts](src/server/express/routes/uia.class.ts)
           - [users.class.ts](src/server/express/routes/users.class.ts)
       - __sockets__
         - [TSSWebSocketServer.ts](src/server/sockets/TSSWebSocketServer.ts)
         - __enums__
           - [socket.enum.ts](src/server/sockets/enums/socket.enum.ts)
         - __events__
           - __mappings__
             - [spec\_data.map.ts](src/server/sockets/events/mappings/spec_data.map.ts)
           - [parser.ts](src/server/sockets/events/parser.ts)
           - [user.class.ts](src/server/sockets/events/user.class.ts)
         - [socketConnectionHandler.ts](src/server/sockets/socketConnectionHandler.ts)
         - [socketInterfaces.ts](src/server/sockets/socketInterfaces.ts)
         - __test\_clients__
           - [spec\_client.ts](src/server/sockets/test_clients/spec_client.ts)
           - [user\_client.ts](src/server/sockets/test_clients/user_client.ts)
         - [vision\-kit.map.ts](src/server/sockets/vision-kit.map.ts)
     - __simulations__
       - [EVASimulation.ts](src/simulations/EVASimulation.ts)
       - __seed__
         - [README.md](src/simulations/seed/README.md)
         - [simfailure.ts](src/simulations/seed/simfailure.ts)
       - __telemetry__
         - [eva\_telemetry.ts](src/simulations/telemetry/eva_telemetry.ts)
         - [uia\_telemetry.ts](src/simulations/telemetry/uia_telemetry.ts)
       - [uiasimulation.ts](src/simulations/uiasimulation.ts)
   - [tsconfig.json](tsconfig.json)

