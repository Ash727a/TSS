import { firstValueFrom } from 'rxjs';
import config from '@app/config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// const url2: string = 'https://suits-2021.herokuapp.com';

@Injectable()
export class LogsService {
  constructor(private http: HttpClient) { }

  // Logging
  async getAllTelemetrySessionLogs() {
    return await firstValueFrom(this.http.get(`${config.BACKEND_URL}/api/telemetrySessionLog`))
      .then((result) => {
        let res: Object[] = result as Object[];
        return { ok: true, payload: res };
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }

  // Station Logs
  async getStationLogByID(station_id: string) {
    return await firstValueFrom(this.http.get(`${config.BACKEND_URL}/api/telemetryStationLog/${station_id}`))
      .then((result) => {
        let res: Object[] = result as Object[];
        return { ok: true, payload: res };
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }

  async getCompletedStationsBySessionLogID(session_log_id: string) {
    return await firstValueFrom(this.http.get(`${config.BACKEND_URL}/api/telemetryStationLog/completed/${session_log_id}`))
      .then((result) => {
        let res: Object[] = result as Object[];
        return { ok: true, payload: res };
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }

  // Geology Logs
  async getGeologyScansBySessionLogID(session_log_id: string) {
    return await firstValueFrom(this.http.get(`${config.BACKEND_URL}/api/specScanLog/session/${session_log_id}`))
      .then((result) => {
        let res: Object[] = result as Object[];
        return { ok: true, payload: res };
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }
}
