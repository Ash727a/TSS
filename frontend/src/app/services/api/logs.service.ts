import { firstValueFrom } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const BACKEND_URL: string = 'http://localhost:8080';
// const url2: string = 'https://suits-2021.herokuapp.com';

@Injectable()
export class LogsService {
  constructor(private http: HttpClient) { }

  // Logging
  async getAllTelemetrySessionLogs() {
    return await firstValueFrom(this.http.get(`${BACKEND_URL}/api/telemetrySessionLog`))
      .then((result) => {
        let res: Object[] = result as Object[];
        return { ok: true, payload: res };
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }
}
