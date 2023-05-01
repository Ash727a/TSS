import { firstValueFrom } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Room } from '@app/core/interfaces';

const BACKEND_URL: string = 'http://localhost:8080';
// const url2: string = 'https://suits-2021.herokuapp.com';

@Injectable()
export class RoomsService {
  constructor(private http: HttpClient) {}

  async getRooms(): Promise<any> {
    try {
      const rooms = await firstValueFrom(this.http.get(`${BACKEND_URL}/api/rooms`));
      return { ok: true, payload: rooms };
    } catch (e) {
      return { ok: false, err: e };
    }
  }

  async getRoomById(roomID: number): Promise<any> {
    try {
      const room = await firstValueFrom(this.http.get(`${BACKEND_URL}/api/rooms/${roomID}`));
      return room;
    } catch (e) {
      return { ok: false, err: e };
    }
  }

  async getRoomByStationName(station_name: string): Promise<any> {
    try {
      const result = await firstValueFrom(this.http.get(`${BACKEND_URL}/api/rooms/station/${station_name}`));
      let res: Object[] = result as Object[];
      return res[0];
    } catch (e) {
      return { ok: false, err: e };
    }
  }

  async updateRoomById(roomID: number, room: any): Promise<any> {
    room.session_log_id = undefined;

    try {
      await firstValueFrom(this.http.put(`${BACKEND_URL}/api/rooms/${roomID}`, room));
      // PUT returns null on success, so return a custom ok object
      return { ok: true };
    } catch (e) {
      return { ok: false, err: e };
    }
  }

  public unassignPreviouslyAssignedRoom(station_name: string): void {
    this.getRoomByStationName(station_name).then((room: Room) => {
      const id = room?.id;
      if (id !== undefined) {
        const payload = {
          id,
          station_name: '',
        };
        this.updateRoomById(id, payload);
      }
    });
  }

  /**
   * This doesn't directly update the DB, it connects with the backend to update the simulation, which updates the DB
   * @param roomID The ID of the room to update
   */
  async updateEVASimulationRoomStation(roomID: number, newStation: string): Promise<any> {
    let station = newStation;
    const body = {
      station: station ?? ''
    }
    const BACKEND_PATH = `${BACKEND_URL}/api/simulationControl/sim/${roomID}/station`;
    try {
      const res = await firstValueFrom(this.http.put(BACKEND_PATH, body));
      // PUT returns null on success, so return a custom ok object
      return { ok: true };
    } catch (e) {
      return { ok: false, err: e };
    }
  }
}
