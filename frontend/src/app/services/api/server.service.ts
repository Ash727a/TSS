import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

const BACKEND_URL: string = 'http://localhost:8080';
// const url2: string = 'https://suits-2021.herokuapp.com';

@Injectable()
export class ServerService {
  constructor(private http: HttpClient) {}

  async getServerConnection(): Promise<any> {
    return await firstValueFrom(this.http.get(`${BACKEND_URL}/conntest`))
      .then((res) => {
        return { ok: true, data: res };
      })
      .catch((ex) => {
        return { ok: false, err: ex };
      });
  }
}
