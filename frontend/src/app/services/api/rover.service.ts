import { firstValueFrom } from 'rxjs';
import config from '@app/config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// const url2: string = 'https://suits-2021.herokuapp.com';

@Injectable()
export class RoverService {
  constructor(private http: HttpClient) {}

  async getRoverStateByRoomID(roomID: number): Promise<any> {
    return await firstValueFrom(this.http.get(`${config.BACKEND_URL}/api/rover/${roomID}`))
      .then((result) => {
        return { ok: true, data: result }
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }

  async updateByRoomID(roomID: number, roverState: object): Promise<any> {
    // console.log(`updating rover\nroomID=${roomID}\nroverState=${JSON.stringify(roverState)}`);
    const url = `${config.BACKEND_URL}/api/rover/${roomID}`
    // console.log('updating rover',roomID, roverState, `\nurl: ${url}`);

    return await firstValueFrom(this.http.put(url, roverState))
      .then((result) => {
        return { ok: true, data: result }
      })
      .catch((e) => {
        console.log(`ERROR: ${JSON.stringify(e)}`);
        return { ok: false, err: e };
      });
  }
}
