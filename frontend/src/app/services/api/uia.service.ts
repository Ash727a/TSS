import { firstValueFrom } from 'rxjs';
import config from '@app/config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// const url2: string = 'https://suits-2021.herokuapp.com';

@Injectable()
export class UIAService {
  constructor(private http: HttpClient) {}

  async getUIAStateByRoomID(roomID: number): Promise<any> {
    return await firstValueFrom(this.http.get(`${config.BACKEND_URL}/api/uia/${roomID}`))
      .then((result) => {
        return { ok: true, data: result }
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }

  async updateByRoomID(roomID: number, uiaState: object): Promise<any> {
    return await firstValueFrom(this.http.put(`${config.BACKEND_URL}/api/uia/${roomID}`, uiaState))
      .then((result) => {
        return { ok: true, data: result }
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }
}
