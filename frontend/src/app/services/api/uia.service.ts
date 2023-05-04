import { firstValueFrom } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const BACKEND_URL: string = 'http://localhost:8080';
// const url2: string = 'https://suits-2021.herokuapp.com';

@Injectable()
export class UIAService {
  constructor(private http: HttpClient) {}

  async getUIAStateByRoomID(roomID: number): Promise<any> {
    return await firstValueFrom(this.http.get(`${BACKEND_URL}/api/uia/${roomID}`))
      .then((result) => {
        return { ok: true, data: result }
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }

  async updateByRoomID(roomID: number, uiaState: object): Promise<any> {
    return await firstValueFrom(this.http.put(`${BACKEND_URL}/api/uia/${roomID}`, uiaState))
      .then((result) => {
        return { ok: true, data: result }
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }
}
