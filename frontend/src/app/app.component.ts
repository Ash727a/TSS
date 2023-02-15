import { Component } from '@angular/core';
import { ServerService } from '@services/api/server.service';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ServerService],
})
export class AppComponent {
  private static readonly NO_CONNECTION_TEXT = 'No Server Connection!';
  private static readonly DATETIME_FORMAT = 'MM-DD-YYYY hh:mm:ss A';

  lastConnectionTime = moment().format(AppComponent.DATETIME_FORMAT);
  connectionError = AppComponent.NO_CONNECTION_TEXT;
  title = 'TSS';
  constructor(private serverService: ServerService) {}

  ngOnInit() {
    setInterval(() => {
      this.serverService.getServerConnection().then((res) => {
        if (res.ok) {
          this.connectionError = '';
          this.lastConnectionTime = moment(res.data.time).format(AppComponent.DATETIME_FORMAT);
        } else {
          this.connectionError = AppComponent.NO_CONNECTION_TEXT;
        }
      });
    }, 2000);
  }
}
