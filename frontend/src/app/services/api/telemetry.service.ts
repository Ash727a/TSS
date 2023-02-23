import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

const BACKEND_URL: string = 'http://localhost:8080';
// const url2: string = 'https://suits-2021.herokuapp.com';

@Injectable()
export class TelemetryService {
  constructor(private http: HttpClient) {}

  async simulationControl(roomID: number, command: string): Promise<any> {
    return await firstValueFrom(this.http.get(`${BACKEND_URL}/api/simulationcontrol/sim/${roomID}/${command}`))
      .then((result) => {
        return result;
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }

  async getTelemetryByRoomID(roomID: number): Promise<any> {
    return await firstValueFrom(this.http.get(`${BACKEND_URL}/api/simulationstate/room/${roomID}`))
      .then((result) => {
        let res: Object[] = result as Object[];
        return res[0];
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }

  async getAllRoomTelemetry(): Promise<any> {
    return await firstValueFrom(this.http.get(`${BACKEND_URL}/api/simulationstate`))
      .then((result) => {
        let res: Object[] = result as Object[];
        return res;
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }

  async getAllSimulationErrors(): Promise<any> {
    return await firstValueFrom(this.http.get(`${BACKEND_URL}/api/simulationfailure`))
      .then((result) => {
        let res: Object[] = result as Object[];
        return res;
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }

  async getSimulationErrorsByRoomID(roomID: number): Promise<any> {
    return await firstValueFrom(this.http.get(`${BACKEND_URL}/api/simulationfailure/room/${roomID}`))
      .then((result) => {
        let res: Object[] = result as Object[];
        return res[0];
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }

  async updateSimulationErrorsByID(id: number, errors: any): Promise<any> {
    return await firstValueFrom(this.http.put(`${BACKEND_URL}/api/simulationfailure/${id}`, errors))
      .then((result) => {
        let res: Object[] = result as Object[];
        return res;
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }
}
