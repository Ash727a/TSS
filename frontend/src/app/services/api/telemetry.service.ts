import { firstValueFrom } from 'rxjs';
import config from '@app/config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SimulationErrorData, TelemetryData } from '@app/core/interfaces';

// const url2: string = 'https://suits-2021.herokuapp.com';

@Injectable()
export class TelemetryService {
  constructor(private http: HttpClient) { }

  async simulationControl(roomID: number, command: string): Promise<any> {
    return await firstValueFrom(this.http.get(`${config.BACKEND_URL}/api/simulationControl/sim/${roomID}/${command}`))
      .then((result) => {
        const res: { ok: boolean, data: string } = { ok: true, data: result as string };
        return res;
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }

  async getTelemetryByRoomID(roomID: number): Promise<any> {
    return await firstValueFrom(this.http.get(`${config.BACKEND_URL}/api/simulationState/${roomID}`))
      .then((result) => {
        let res: TelemetryData = result as TelemetryData;
        return res;
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }

  async getAllRoomTelemetry(): Promise<any> {
    return await firstValueFrom(this.http.get(`${config.BACKEND_URL}/api/simulationState`))
      .then((result) => {
        let res: TelemetryData[] = result as TelemetryData[];
        return res;
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }

  async getAllSimulationErrors(): Promise<any> {
    return await firstValueFrom(this.http.get(`${config.BACKEND_URL}/api/simulationFailure`))
      .then((result) => {
        let res: SimulationErrorData[] = result as SimulationErrorData[];
        return res;
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }

  async getSimulationErrorsByRoomID(roomID: number): Promise<any> {
    return await firstValueFrom(this.http.get(`${config.BACKEND_URL}/api/simulationFailure/${roomID}`))
      .then((result) => {
        let res: SimulationErrorData = result as SimulationErrorData;
        return res as SimulationErrorData;
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }

  async updateSimulationErrorsByID(id: number, errors: any): Promise<any> {
    return await firstValueFrom(this.http.put(`${config.BACKEND_URL}/api/simulationFailure/${id}`, errors))
      .then((result) => {
        let res: Object[] = result as Object[];
        return res;
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }

  /**
   * If the backend disconnected, restore the simulations (create new sim instances) from the data in the live database
   */
  async restoreSimulations(): Promise<any> {
    return await firstValueFrom(this.http.put(`${config.BACKEND_URL}/api/simulationControl/sim/restore`, { restore: true }))
      .then((result) => {
        let res: Object[] = result as Object[];
        return res;
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }

  // Logging
  async getAllSessionLogs() {
    return await firstValueFrom(this.http.get(`${config.BACKEND_URL}/api/telemetrySessionLog`))
      .then((result) => {
        let res: Object[] = result as Object[];
        return res;
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }

}
