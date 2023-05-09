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
  private static readonly DATETIME_FORMAT = 'MM-DD-YYYY hh:mm:ss A';
  private interval!: ReturnType<typeof setTimeout>;
  protected lastConnectionTime = moment().format(AppComponent.DATETIME_FORMAT);
  protected connectionStatus: string = 'pending';
  constructor(private serverService: ServerService) {}

  ngOnInit() {
    this.interval = setInterval(() => {
      this.serverService.getServerConnection().then((res) => {
        if (res.ok) {
          this.connectionStatus = 'connected';
          this.lastConnectionTime = moment(res.data.time).format(AppComponent.DATETIME_FORMAT);
        } else {
          this.connectionStatus = 'disconnected';
        }
      });
    }, 2000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
