import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

const BACKEND_URL: string = 'http://localhost:8080';
// const url2: string = 'https://suits-2021.herokuapp.com';

@Injectable()
export class UIAService {
  constructor(private http: HttpClient) {}

  async getUIAStateByRoomID(roomID: number): Promise<any> {
    return await firstValueFrom(this.http.get(`${BACKEND_URL}/api/simulationuia/room/${roomID}`))
      .then((result) => {
        return { ok: true, data: result }
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }
}
