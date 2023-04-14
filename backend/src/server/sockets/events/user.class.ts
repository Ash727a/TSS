import { WebSocket } from 'ws';

import { liveModels } from '../../../database/models/index.js';
import { CrewmemberMsg } from '../socketInterfaces.js';

// import { ISocketServerModels } from '../model_interfaces.js';
import type user from '../../../database/models/teams/user.model.js';

type ModelsForUser = Pick<typeof liveModels, 'user' | 'room' | 'simulationState' | 'geo' | 'gpsMsg' | 'imuMsg'>;
class User {
  // private room_id: number;
  private readonly username: string;
  private readonly guid: string;
  private readonly university: string;
  private _models: ModelsForUser;
  private _ws: WebSocket;
  private user_record: user;

  private constructor(
    { username, user_guid, university }: CrewmemberMsg['BLOB']['DATA'],
    _models: ModelsForUser,
    user_record: user,
    _ws: WebSocket,
    hmd_update_interval: number
  ) {
    this.username = username;
    this.guid = user_guid;
    this.university = university;
    this._models = _models;
    this.user_record = user_record;
    this._ws = _ws;

    const send_data_interval = setInterval(() => this.sendData(), hmd_update_interval);

    this._ws.on('close', async () => {
      console.log(`*** USER: ${this.user_record.username} DISCONNECTED ***`);

      // stop sim
      // http.get(STOP_SIM_URL + `${session_room_id}/stop`);

      this.user_record.update({ is_connected: false });
      clearInterval(send_data_interval);
      this._ws.terminate();
    });
  }

  // TODO: CHANGE TO ACTUAL FK, BUT NULLABLE
  // TODO: VALIDATE GUID AND USERNAME - MAYBE JUST USE AN OBJECT AS A MAP
  public static async build(
    { username, user_guid, university }: CrewmemberMsg['BLOB']['DATA'],
    _models: ModelsForUser,
    _ws: WebSocket,
    hmd_update_interval: number
  ): Promise<User | null> {
    const user = await _models.user;
    const room = await _models.room;

    try {
      let user_record = await user.findOne({ where: { user_guid: user_guid, username: username } });

      if (user_record) {
        console.log(`Found existing user with username: ${username}`);

        // Reject connections if user is already connected
        if (user_record?.is_connected) {
          console.log(`${username} is already conencted. Cannot create new instance`);
          return null;
        }
        user_record.update({ is_connected: true });
      } else {
        const empty_room = await room.findOne({ where: { user_guid: null } });
        if (empty_room === null) {
          console.log(`No empty room found to assign the following user to:\nUsername: ${username}`);
          return null;
        }
        empty_room.update({ user_guid: user_guid });
        empty_room.save();
        user_record = await user.create({
          username: username,
          user_guid: user_guid,
          university: university,
          room_id: empty_room.id,
          is_connected: true,
        });
        console.log(`${username} assigned to room ${empty_room.name}`);
      }
      return new User({ username, user_guid, university }, _models, user_record, _ws, hmd_update_interval);

      //check if assigned room is vacant
      // if (assigned_room) {
      //   await room.update({ client_id: this.guid }, { where: { [primaryKeyOf(room)]: this.room_id } }); //assign the client_id to the room
      //   await assigned_room.save();
      //   console.log(`${this.username} assigned to room ${this.room_id}.`);
      //   return false;
      // } else {
      //   console.log(`This room is not available.`); //this shouldn't happen
      //   return true;
      // }
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async sendData(): Promise<void> {
    try {
      const room_id = this.user_record.room_id;

      const sim_state_res = await this._models.simulationState.findOne({
        where: { room_id: room_id },
      });

      const sim_state = sim_state_res?.get({ plain: true });
      if (sim_state == undefined) {
        return;
      }
      const gps_val = await this._models.gpsMsg.findOne({ where: { user_guid: this.guid } });
      const imu_val = await this._models.imuMsg.findOne({ where: { user_guid: this.guid } });

      const spec_data = await this._models.geo.findOne({
        where: {
          room_id: room_id,
        },
      });

      const data = {
        gpsMsg: gps_val,
        imuMsg: imu_val,
        simulationStates: sim_state,
        specMsg: spec_data?.rock_data ? JSON.parse(spec_data.rock_data) : null,
        // add rover data
      };

      if (sim_state?.is_running) {
        this._ws.send(JSON.stringify(data));
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }
}

export default User;
