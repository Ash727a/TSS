import { IAllModels } from '../../../database/models/index.js';
import { primaryKeyOf } from '../../../helpers.js';
import { SpecMsg } from '../socketInterfaces.js';
import { CrewmemberMsgBlob, SocketMsg } from '../socket_interfaces.js';
import { isValidRockId, spec_data_map } from './mappings/spec_data.map.js';
import User from './user.class.js';

class Parser {
  // constructor() {}

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

  async handleSpecData(spec_msg: SpecMsg, _model: Pick<IAllModels, 'geo' | 'room'>): Promise<void> {
    // 1. Map rfid ID -> spec data (either through db or just an object)
    const tag_id = spec_msg.BLOB.DATA.TAG_ID;
    if (!isValidRockId(tag_id)) {
      console.log(`"${tag_id}" is not a valid rfid tag id`);
      return;
    }

    const room_in_geo = await _model.room.findOne({ where: { station_name: 'GEO' } });
    if (room_in_geo == null) {
      console.log('No room is in the geology task');
      return;
    }

    // 2. Add scan to record for the room currently in GEO
    _model.geo.update(
      {
        rock_tag_id: tag_id,
        rock_data: JSON.stringify(spec_data_map[tag_id]),
      },
      {
        where: {
          room_id: room_in_geo.id,
        },
      }
    );

    console.log(
      `Recording: ${{
        rock_tag_id: tag_id,
        rock_data: JSON.stringify(spec_data_map[tag_id]),
      }} under room ${room_in_geo.name}`
    );

    // TODO: Log tag_id and scan_time to logs db
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
