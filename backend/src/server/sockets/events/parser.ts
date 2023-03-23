import { primaryKeyOf } from '../../../helpers.js';
import { SocketMsg, CrewmemberMsgBlob } from '../socket_interfaces.js';
import User from './user.class.js';

class Parser {
  // constructor() {}

  parseMessage(data: { toString: () => string }, cb: (arg0: null, arg1: any) => void): void {
    const obj = JSON.parse(data.toString());
    console.log(obj);
    // console.log(obj);
    // if( (obj.event !== 'connection' && !obj.id) && !obj.event && !obj.payload) {
    //     console.log(`ERR-PRSVAL`);
    //     return cb(`ERR-PRSVAL`, null);
    // }
    return cb(null, obj);
  }

  async parseMessageIMU(obj: { [x: string]: any }, models: { [x: string]: any; imuMsg?: any }): Promise<void> {
    const imuMsg = await models.imuMsg;

    for (const elem in obj)
      if (elem === 'id') delete obj[elem];
      else obj[elem] = parseFloat(obj[elem]);

    try {
      if ((await models.imuMsg.count()) === 0) {
        imuMsg.create(obj);
      } else {
        imuMsg.update(obj, {
          where: { [primaryKeyOf(imuMsg)]: 1 },
        });
      }
      return imuMsg;
    } catch (e) {
      console.log(e);
    }
  }

  async parseMessageGPS(obj: { [x: string]: any }, models: { [x: string]: any; gpsMsg?: any }): Promise<void> {
    const gpsMsg = await models.gpsMsg;

    for (const elem in obj)
      if (elem === 'class') delete obj[elem];
      else obj[elem] = parseFloat(obj[elem]);

    try {
      if ((await models.gpsMsg.count()) == 0) {
        console.log('GPS TABLE CREATED');
        gpsMsg.create(obj);
      } else {
        gpsMsg.update(obj, {
          where: { [primaryKeyOf(gpsMsg)]: 1 },
        });
      }
      return gpsMsg;
    } catch (e) {
      console.log(e);
    }
  }

  parseMessageCrewmember(msg: SocketMsg<CrewmemberMsgBlob>): void {
    const room_id = msg.BLOB.DATA.room_id;
    const username = msg.BLOB.DATA.username;
    const client_id = msg.BLOB.DATA.client_id;

    const user = new User(username, client_id, room_id);
    if (user) {
      // Register the user in the database and assign them to room
      duplicate = await user.registerUser(msg.BLOB.DATA, _models);
    }

    // Add the client to the room
    if (!duplicate) {
      ws.roomId = room_id;
      setInterval(() => sendData(), HMD_UPDATE_INTERVAL);
    } else {
      ws.send('Connection failed, duplicate sign on attempt.');
      ws.close(1008, 'Duplicate user');
      console.log(`Connection Failed: Duplicate User.`);
    }
  }
}

export default Parser;
