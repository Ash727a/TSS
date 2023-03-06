import { Component, ViewChild, ViewContainerRef, TemplateRef } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { LogsService } from '@services/api/logs.service';
import { ModalService } from '@services/modal/modal.service';
import { ModalEvent } from '@core/interfaces';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
  providers: [LogsService, ModalService],
})


export class LogsComponent {
  private static readonly TIMESTAMP_FORMAT = 'MMMM Do YYYY, h:mm:ss a';

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
