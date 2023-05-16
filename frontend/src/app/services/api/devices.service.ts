import { firstValueFrom } from 'rxjs';
import config from '@app/config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// const url2: string = 'https://suits-2021.herokuapp.com';

@Injectable()
export class DevicesService {
  constructor(private http: HttpClient) { }

  async getDeviceByName(name: string): Promise<any> {
    return await firstValueFrom(this.http.get(`${config.BACKEND_URL}/api/devices/${name}`))
      .then((result) => {
        return { ok: true, data: result }
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }

  async updateRoverAssignedRoom(room_id: number): Promise<any> {
    return await firstValueFrom(this.http.put(`${config.BACKEND_URL}/api/devices/rover/room_id`, { room_id: room_id }))
      .then((result) => {
        return { ok: true, data: result }
      }
      ).catch((e) => {
        return { ok: false, err: e };
      });
  }
}
