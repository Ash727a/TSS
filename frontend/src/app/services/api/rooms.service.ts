import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const BACKEND_URL: string = 'http://localhost:8080';
// const url2: string = 'https://suits-2021.herokuapp.com';

@Injectable()
export class RoomsService {
  constructor(private http: HttpClient) {}

  async getRooms(): Promise<any> {
    try {
      const rooms = await this.http.get(`${BACKEND_URL}/api/rooms`).toPromise();
      return rooms;
    } catch (e) {
      return { ok: false, err: e };
    }
  }
}
