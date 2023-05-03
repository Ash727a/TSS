import { Component, ViewChild, ViewContainerRef, TemplateRef } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { LogsService } from '@services/api/logs.service';
import { ModalService } from '@services/modal/modal.service';
import { ModalEvent } from '@core/interfaces';

// TODO
/**
 * Required:
 * - Show team name
 * - Show errors thrown & resolved status
 * - Show stations assigned, time spent at each station
 * - Show marks for completed/not completed
 * - Visibly show if the status is "in progress" or "completed"
 * 
 * Desired:
 * - Sorting/filtering
 */

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
  providers: [LogsService, ModalService],
})


export class LogsComponent {
  private static readonly TIMESTAMP_FORMAT = 'MMMM Do YYYY, h:mm A';

  logs!: any[];
  protected selectedLog!: any;
  private modalOpen:boolean = false;

  @ViewChild('modal', { read: ViewContainerRef }) private entry!: ViewContainerRef;
  private sub!: Subscription;

  @ViewChild('modal') private modalContentRef!: TemplateRef<any>;

  constructor(private logsService: LogsService, private modalService: ModalService) { }

  async ngOnInit() {
    this.logsService.getAllTelemetrySessionLogs().then((result: any) => {
      if (result.ok) {
        let logData = result.payload;
        for (let log of logData) {
          const _start = log.start_time;
          const _end = log.end_time;
          log.start_time = moment(_start).format(LogsComponent.TIMESTAMP_FORMAT);
          log.end_time = log.end_time ? moment(_end).format(LogsComponent.TIMESTAMP_FORMAT) : 'Not yet ended';
          // Check if the start and end are on the same day
          const start_date = moment(_start).format('MMMM Do YYYY');
          const end_date = moment(_end).format('MMMM Do YYYY');
          let date = start_date; // Formatted as March 6th, 2023
          if (start_date !== end_date && end_date != 'Invalid date') {
            date += ` - ${end_date}`; // Formatted as March 6th, 2023 - March 7th, 2023
          }
          log.date = date;
          // Calculate duration
          const duration = moment.duration(moment(_end).diff(moment(_start)));
          if (duration.isValid()) {
            log.duration = `${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
          }
        }
        this.logs = result.payload;
        console.log(this.logs);
      };
    }).catch(e => {
      console.log(e);
    });
  }

  protected openModal(log: any): void {
    this.modalOpen = true;
    this.selectedLog = log;
    // Wait a little bit for a HTML to update so the correct data is displayed in the modal
    setTimeout(() => {
      this.sub = this.modalService.openModal(this.entry, this.modalContentRef).subscribe((v: string) => {
        if (v === ModalEvent.CLOSE) {
          this.selectedLog = null;
          this.modalOpen = false;
        }
      });
    }, 100);
  }
}
