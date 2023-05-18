import { WebSocket } from 'ws';

import { liveModels } from '../../../database/models/index.js';
import { CrewmemberMsg } from '../socketInterfaces.js';

// import { ISocketServerModels } from '../model_interfaces.js';
import type user from '../../../database/models/teams/user.model.js';

type ModelsForUser = Pick<
  typeof liveModels,
  'user' | 'room' | 'simulationState' | 'geo' | 'gpsMsg' | 'imuMsg' | 'uia' | 'rover' | 'simulationFailure'
>;
class User {
  // private room_id: number;
  private readonly team_name: string;
  private readonly username: string;
  private readonly guid: string;
  private readonly university: string;
  private _models: ModelsForUser;
  private _ws: WebSocket;
  private user_record: user;

  private constructor(
    registration_info: CrewmemberMsg['BLOB']['DATA'],
    _models: ModelsForUser,
    user_record: user,
    _ws: WebSocket,
    hmd_update_interval: number
  ) {
    this.team_name = registration_info.team_name;
    this.username = registration_info.username;
    this.guid = registration_info.user_guid;
    this.university = registration_info.university;
    this._models = _models;
    this.user_record = user_record;
    this._ws = _ws;

    const send_data_interval = setInterval(() => this.sendData(), hmd_update_interval);

    this._ws.on('close', async () => {
      console.log(`*** USER: ${this.user_record.username} DISCONNECTED ***`);

      // stop sim
      // http.get(STOP_SIM_URL + `${session_room_id}/stop`);

      this.user_record.update({ hmd_is_connected: false });
      clearInterval(send_data_interval);
      this._ws.terminate();
    });
  }

  // TODO: CHANGE TO ACTUAL FK, BUT NULLABLE
  // TODO: VALIDATE GUID AND USERNAME - MAYBE JUST USE AN OBJECT AS A MAP
  public static async build(
    registration_info: CrewmemberMsg['BLOB']['DATA'],
    _models: ModelsForUser,
    _ws: WebSocket,
    hmd_update_interval: number
  ): Promise<User | null> {
    const user = await _models.user;
    const room = await _models.room;

    try {
      let user_record = await user.findOne({
        where: { user_guid: registration_info.user_guid },
      });
      if (user_record) {
        // Reject connections if user is already connected
        if (user_record?.hmd_is_connected) {
          console.log(`${registration_info.username} is already connected. Cannot create new instance`);
          return null;
        }
        user_record.update({ hmd_is_connected: true });
      } else {
        const empty_room = await room.findOne({ where: { user_guid: null } });
        if (empty_room === null) {
          console.log(`No empty room found to assign the following user to:\nUsername: ${registration_info.username}`);
          return null;
        }
        empty_room.update({ user_guid: registration_info.user_guid });
        empty_room.save();
        user_record = await user.create({
          team_name: registration_info.team_name,
          username: registration_info.username,
          user_guid: registration_info.user_guid,
          university: registration_info.university,
          room_id: empty_room.id,
          hmd_is_connected: true,
          vk_is_connected: false,
        });
        console.log(`${registration_info.username} assigned to room ${empty_room.name}`);
      }
      return new User(registration_info, _models, user_record, _ws, hmd_update_interval);

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
        attributes: { exclude: ['createdAt', 'updatedAt', 'user_guid'] },
      });

      const simulation_failures = await this._models.simulationFailure.findOne({
        where: { room_id: room_id },
        attributes: ['room_id', 'started_at', 'o2_error', 'pump_error', 'power_error', 'fan_error']
      });

      const sim_state = sim_state_res?.get({ plain: true });
      if (sim_state == undefined) {
        return;
      }
      const gps_val = await this._models.gpsMsg.findOne({
        where: { user_guid: this.guid },
        attributes: { exclude: ['createdAt', 'updatedAt', 'user_guid'] },
      });
      const imu_val = await this._models.imuMsg.findOne({
        where: { user_guid: this.guid },
        attributes: { exclude: ['createdAt', 'updatedAt', 'user_guid'] },
      });

      const spec_data = await this._models.geo.findOne({
        where: {
          room_id: room_id,
        },
      });

      const rover_data = await this._models.rover.findOne({
        where: {
          room_id: room_id,
        },
      });

      // Assumes UIA PK is just the room id
      const uiaMsg = await this._models.uia.findByPk(room_id);

      const data = {
        gpsMsg: gps_val,
        imuMsg: imu_val,
        simulationStates: sim_state,
        simulationFailures: simulation_failures,
        uiaMsg: uiaMsg,
        specMsg: spec_data?.rock_data ? JSON.parse(spec_data.rock_data) : {},
        // add rover data
        roverMsg: rover_data,
      };

      if (sim_state?.is_running) {
        this._ws.send(JSON.stringify(data));
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }

  public updateRovCmd(payload: any): any {
    // update table that has room id matching
    this._models.rover.update(payload, { where: { room_id: this.user_record.room_id } });
  }
}

export default User;
