import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const BACKEND_URL: string = 'http://localhost:8080';
// const url2: string = 'https://suits-2021.herokuapp.com';

@Injectable()
export class TelemetryService {
  constructor(private http: HttpClient) {}

  async simulationControl(roomID: number, command: string): Promise<any> {
    return this.http
      .get(`${BACKEND_URL}/api/simulationcontrol/sim/${roomID}/${command}`)
      .toPromise()
      .then((result) => {
        return result;
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }

  async getTelemetry(roomID: number): Promise<any> {
    return this.http
      .get(`${BACKEND_URL}/api/simulationstate/room/${roomID}`)
      .toPromise()
      .then((result) => {
        let res: Object[] = result as Object[];
        return res[0];
      })
      .catch((ex) => {
        return { ok: false, err: ex };
      });
  }
}
