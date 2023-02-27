import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Room } from '@app/core/interfaces';

const BACKEND_URL: string = 'http://localhost:8080';
// const url2: string = 'https://suits-2021.herokuapp.com';

@Injectable()
export class RoomsService {
  constructor(private http: HttpClient) {}

  async getRooms(): Promise<any> {
    try {
      const rooms = await firstValueFrom(this.http.get(`${BACKEND_URL}/api/rooms`));
      return rooms;
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

  async getRoomByStationName(stationName: string): Promise<any> {
    try {
      const result = await firstValueFrom(this.http.get(`${BACKEND_URL}/api/rooms/station/${stationName}`));
      let res: Object[] = result as Object[];
      return res[0];
    } catch (e) {
      return { ok: false, err: e };
    }
  }

  async updateRoomById(roomID: number, room: any): Promise<any> {
    try {
      await firstValueFrom(this.http.put(`${BACKEND_URL}/api/rooms/${roomID}`, room));
      // PUT returns null on success, so return a custom ok object
      return { ok: true };
    } catch (e) {
      return { ok: false, err: e };
    }
  }

  public unassignPreviouslyAssignedRoom(stationName: string): void {
    this.getRoomByStationName(stationName).then((room: Room) => {
      const id = room?.id;
      if (id !== undefined) {
        const payload = {
          id,
          stationName: '',
        };
        this.updateRoomById(id, payload);
      }
    });
  }
}
