import { WebSocket } from 'ws';

import Parser from './events/parser.js';
import User from './events/user.class.js';

import type { IAllModels } from '../../database/models/index.js';

import type { CrewmemberMsg, GpsMsg, IMUMsg, SpecMsg, UnknownMsg } from './socketInterfaces.js';
import { DATATYPE } from './enums/socket.enum.js';
import visionKitMap from './vision-kit.map.js';

export default function handleSocketConnection(_ws: WebSocket, _models: IAllModels, hmd_update_interval: number): void {
  const parser = new Parser();

  _ws.on('message', async (data) => {
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
      _ws.send(JSON.stringify({ ERR: "MSGTYPE isn't DATA" }));
      return;
    }

    switch (parsedMsg.BLOB.DATATYPE) {
      case DATATYPE.HMD: {
        const crewMemberMsg = parsedMsg as CrewmemberMsg;

        if (!(crewMemberMsg.BLOB.DATA.user_guid in visionKitMap)) {
          console.log(`Crewmember provided invalid user_guid: ${crewMemberMsg.BLOB.DATA.user_guid}`);
          _ws.close(1008, `Invalid use_guid. Please ensure user_guid matches visionkit's guid`);
          break;
        }
        const user = await User.build(crewMemberMsg.BLOB.DATA, _models, _ws, hmd_update_interval);

        if (user == null) {
          _ws.close(1008, 'Failed to register user');
          console.log('Failed to register user');
        }
        break;
      }

      case DATATYPE.IMU: {
        // console.log('IMU');
        const imuMsg = parsedMsg as unknown as IMUMsg;
        if (!(imuMsg.MACADDRESS in visionKitMap)) {
          console.log(`Following MACADDRESS is invalid: ${imuMsg.MACADDRESS}`);
          _ws.close(1008, `Invalid visionkit guid. Please ensure the vkid in the visionkit's .env is correct`);
          break;
        }
        parser.parseMessageIMU(imuMsg, _models);
        break;
      }
      case DATATYPE.GPS: {
        // console.log('GPS');
        const gpsMsg = parsedMsg as GpsMsg;
        if (!(gpsMsg.MACADDRESS in visionKitMap)) {
          console.log(`Following MACADDRESS is invalid: ${gpsMsg.MACADDRESS}`);
          _ws.close(1008, `Invalid visionkit guid. Please ensure the vkid in the visionkit's .env is correct`);
          break;
        }

        parser.parseMessageGPS(gpsMsg, _models);
        break;
      }
      case DATATYPE.SPEC: {
        const specMsg = parsedMsg as SpecMsg;
        await parser.handleSpecData(specMsg, _models);
        break;
      }
      default: {
        console.log(`Invalid parsedMsg.BLOB.DATATYPE: ${parsedMsg.BLOB.DATATYPE}`);
        _ws.close(1008, `Invalid parsedMsg.BLOB.DATATYPE: ${parsedMsg.BLOB.DATATYPE}`);
        break;
      }
    }
  });
}
