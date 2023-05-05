import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import config from '@app/config';

// const url2: string = 'https://suits-2021.herokuapp.com';

@Injectable()
export class ServerService {
  onConnectionStatusChange: EventEmitter<object> = new EventEmitter();
  private connectionStatus = false;
  constructor(private http: HttpClient) {}

  async getServerConnection(): Promise<any> {
    return await firstValueFrom(this.http.get(`${config.BACKEND_URL}/conntest`))
      .then((res) => {
        // Detect if it was previously disconnected
        if (this.connectionStatus === false) {
          console.log('Backend connected')
          this.onConnectionStatusChange.emit({ current: true, previous: false });
          this.connectionStatus = true;
        }
        return { ok: true, data: res };
      })
      .catch((e) => {
        // Detect if it was previously connected
        if (this.connectionStatus === true) {
          console.log('Backend disconnected');
          this.onConnectionStatusChange.emit({ current: false, previous: true });
          this.connectionStatus = false;
        } else {
          console.log('Error: Backend is not connected. Trying to reconnect...');
        }
        return { ok: false, err: e };
      });
  }
}
