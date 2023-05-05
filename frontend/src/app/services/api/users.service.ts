import { firstValueFrom } from 'rxjs';
import config from '@app/config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// const url2: string = 'https://suits-2021.herokuapp.com';

@Injectable()
export class UsersService {
  constructor(private http: HttpClient) {}

  async getUserByID(user_guid: string): Promise<any> {
    return await firstValueFrom(this.http.get(`${config.BACKEND_URL}/api/users/${user_guid}`))
      .then((result) => {
        return { ok: true, data: result }
      })
      .catch((e) => {
        return { ok: false, err: e };
      });
  }
}
