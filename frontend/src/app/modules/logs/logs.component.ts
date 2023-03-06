import { Component } from '@angular/core';
import * as moment from 'moment';
import { LogsService } from '@services/api/logs.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
  providers: [LogsService],
})


export class LogsComponent {
  private static readonly TIMESTAMP_FORMAT = 'MMMM Do YYYY, h:mm:ss a';

  logs!: any[];

  constructor(private logsService: LogsService) { }

  async ngOnInit() {
    this.logsService.getAllTelemetrySessionLogs().then((result: any) => {
      if (result.ok) {
        let logData = result.payload;
//         createdAt
// : 
// "2023-03-06T16:29:56.352Z"
// end_time
// : 
// "2023-03-06T16:30:03.089Z"
// room_id
// : 
// 1
// session_id
// : 
// "7984ba9e-0c1a-45bd-97a1-e88f7c78bb0c"
// start_time
// : 
// "2023-03-06T16:29:56.351Z"
// updatedAt
// : 
// "2023-03-06T16:30:03.090Z
        for (let log of logData) {
          log.start_time = moment(log.start_time).format(LogsComponent.TIMESTAMP_FORMAT);
          log.end_time = log.end_time ? moment(log.end_time).format(LogsComponent.TIMESTAMP_FORMAT) : 'Not yet ended';
        
        }
        this.logs = result.payload;
        console.log(this.logs);
      };
    }).catch(e => {
      console.log(e);
    });
  }
}
