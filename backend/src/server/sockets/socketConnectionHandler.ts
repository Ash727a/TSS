import { WebSocket } from 'ws';

import Parser from './events/parser.js';
import User from './events/user.class.js';

import type { IAllModels } from '../../database/models/index.js';

import type { CrewmemberMsg, GpsMsg, IMUMsg, SpecMsg, UnknownMsg } from './socketInterfaces.js';
import { DATATYPE } from './enums/socket.enum.js';
import visionKitMap from './vision-kit.map.js';

export default function handleSocketConnection(ws: WebSocket, models: IAllModels, hmd_update_interval: number): void {
  const parser = new Parser();

  ws.on('message', async (data) => {
    console.log(`** MESSAGE RECEIVED **`);

    const parsedMsg = JSON.parse(data.toString('utf-8')) as UnknownMsg;
    // console.log(data);
    // const msgtype = parsedMsg.MSGTYPE;
    // const header = parsedMsg.BLOB;
    // const datatype = header.DATATYPE;
    // const msgdata = header.DATA;

    //Client messages are always DATA
    if (parsedMsg.MSGTYPE !== 'DATA') {
      console.log(`MSGTYPE !== 'DATA' in:\n${parsedMsg}`);
      ws.send(JSON.stringify({ ERR: "MSGTYPE isn't DATA" }));
      return;
    }

    switch (parsedMsg.BLOB.DATATYPE) {
      case DATATYPE.HMD: {
        const crewMemberMsg = parsedMsg as CrewmemberMsg;

        if (!(crewMemberMsg.BLOB.DATA.user_guid in visionKitMap)) {
          console.log(`Crewmember provided invalid user_guid: ${crewMemberMsg.BLOB.DATA.user_guid}`);
          ws.close(1008, `Invalid user_guid. Please ensure user_guid matches visionkit's guid`);
          break;
        }
        const user = await User.build(crewMemberMsg.BLOB.DATA, models, ws, hmd_update_interval);

        if (user == null) {
          ws.close(1008, 'Failed to register user');
          console.log('Failed to register user');
        }
        break;
      }

      case DATATYPE.IMU: {
        const imuMsg = parsedMsg as unknown as IMUMsg;
        if (!(imuMsg.MACADDRESS in visionKitMap)) {
          console.log(`Following guid from visionkit is invalid: ${imuMsg.MACADDRESS}`);
          ws.close(1008, `Invalid visionkit guid. Please ensure the vkid in the visionkit's .env is correct`);
          break;
        }
        parser.parseMessageIMU(imuMsg, models);
        break;
      }
      case DATATYPE.GPS: {
        const gpsMsg = parsedMsg as GpsMsg;
        if (!(gpsMsg.MACADDRESS in visionKitMap)) {
          console.log(`Following guid from visionkit is invalid: ${gpsMsg.MACADDRESS}`);
          ws.close(1008, `Invalid visionkit guid. Please ensure the vkid in the visionkit's .env is correct`);
          break;
        }
        parser.parseMessageGPS(gpsMsg, models);
        break;
      }
      case DATATYPE.SPEC: {
        const specMsg = parsedMsg as SpecMsg;
        await parser.handleSpecData(specMsg, models);
        break;
      }
      default: {
        console.log(`Invalid parsedMsg.BLOB.DATATYPE: ${parsedMsg.BLOB.DATATYPE}`);
        ws.close(1008, `Invalid parsedMsg.BLOB.DATATYPE: ${parsedMsg.BLOB.DATATYPE}`);
        break;
      }
    }
  });
}
