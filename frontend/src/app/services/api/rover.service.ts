import { firstValueFrom } from 'rxjs';
import config from '@app/config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// const url2: string = 'https://suits-2021.herokuapp.com';

@Injectable()
export class RoverService {
  constructor(private http: HttpClient) {}

  async getRoverStateByRoomID(roomID: number): Promise<any> {
    console.log("GETING STATE", roomID)
    return await firstValueFrom(this.http.get(`${config.BACKEND_URL}/api/rover/${roomID}`))
      .then((result) => {
        return { ok: true, data: result }
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }

  async updateByRoomID(roomID: number, roverState: object): Promise<any> {
    console.log('updating rover ', roomID, roverState);
    return await firstValueFrom(this.http.put(`${config.BACKEND_URL}/api/rover/${roomID}`, roverState))
      .then((result) => {
        return { ok: true, data: result }
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }
}
