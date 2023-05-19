import { Component, Input } from '@angular/core';
import { Room } from '@app/core/interfaces';
// Backend
// Backend
import { RoomsService } from '@services/api/rooms.service';
import { LogsService } from '@services/api/logs.service';

const POLL_INTERVAL = 1000 as const;

@Component({
  selector: 'app-geology',
  templateUrl: './geology.component.html',
  styleUrls: ['./geology.component.scss'],
  providers: [RoomsService, LogsService],
})
export class GeologyComponent {
  @Input() public variant: 'default' | 'small' = 'default';
  @Input() selectedRoom: Room | null = null;
  private pollGeoInterval?: ReturnType<typeof setTimeout>;
  protected logs: any[] = [];

  constructor(private logsService: LogsService, private roomsService: RoomsService) {
    
  }

  ngOnInit() {
    // On init fetch the room assigned to GEO
    this.roomsService.getRoomByStationName('GEO').then((result) => {
      this.selectedRoom = result;
    });
    this.pollGeologyLogs();
  }

  /**
   * Fetch the geo logs tied to the current telemetry session for the room
   */
  private pollGeologyLogs() {
    this.pollGeoInterval = setInterval(async () => {
      if (!this.selectedRoom || !this.selectedRoom.id) {
        return;
      }
      // const roomID = this.selectedRoom?.id;
      const session_log_id = this.selectedRoom?.session_log_id;
      // Get the rover's data from the database
      const result: any = await this.logsService.getGeologyScansBySessionLogID(session_log_id);
      if (result.ok) {
        this.logs = result.payload;
      }
    }, POLL_INTERVAL);
  }

  ngOnDestroy() {
    if (this.pollGeoInterval) {
      clearInterval(this.pollGeoInterval);
    }
  }
}
