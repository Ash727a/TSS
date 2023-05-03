import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Room } from '@app/core/interfaces';
// Backend
import { RoomsService } from '@services/api/rooms.service';
import { LogsService } from '@services/api/logs.service';


@Component({
  selector: 'app-rooms-station-switch-card',
  templateUrl: './station-switch-card.component.html',
  styleUrls: ['./station-switch-card.component.scss'],
  providers: [LogsService],
})
export class StationSwitchCardComponent implements OnInit, OnDestroy {
  @Input() selectedRoom: Room | null = null;

  constructor(private roomsService: RoomsService, private logsService: LogsService) {}

  protected stations: { value: 'UIA' | 'GEO' | 'ROV', isActive: boolean, time?: string, status: 'current' | 'incomplete' | 'completed' }[] = [
    { value: 'UIA', isActive: false, status: 'incomplete' },
    { value: 'GEO', isActive: false, status: 'incomplete' },
    { value: 'ROV', isActive: false, status: 'incomplete' },
  ];

  ngOnInit(): void {
    this.setStationStatusData();
  }

  private setStationStatusData(): void {
    for (let i: number = 0; i < this.stations.length; i++) {
      this.stations[i].time = '00:00';
      if (this.selectedRoom?.station_name === this.stations[i].value) {
        this.stations[i].isActive = true;
        this.stations[i].status = 'current';
        // This is the current assigned station, fetch the station log to get the time
        if (this.selectedRoom?.station_log_id) {
          this.logsService.getStationLogByID(this.selectedRoom.station_log_id).then((result: any) => {
            if (result.ok) {
              const stationLog = result.payload;
              if (stationLog.end_time) {
                console.log('Skipping station assignment heartbeat because station log already has an end time');
                return;
              }
              const time = new Date(stationLog.start_time).getTime();
              const now = new Date().getTime();
              const timeDiff = now - time;
              // Change to slice(11,19) if you want HH:MM:SS, or slice(14,19) if you want MM:SS
              const durationDisplay = new Date(timeDiff).toISOString().slice(14,19);
              this.stations[i].time = durationDisplay;
              console.log(durationDisplay);
            }
          });
        }
      } else {
        this.stations[i].isActive = false;
        this.stations[i].status = 'incomplete';
      }
    }
  }

  protected handleStationChange(eventType: 'ASSIGN' | 'UNASSIGN', stationString: 'UIA' | 'GEO' | 'ROV') {
    if (!this.selectedRoom) return;
    let station_name: any = stationString;
    if (eventType === 'UNASSIGN') {
      station_name = '';
    }
    this.roomsService.updateEVASimulationRoomStation(this.selectedRoom.id, station_name).then((result) => {
      // Give it time to update the DB
      setTimeout(() => {
        if (result.ok && this.selectedRoom) {
          this.roomsService.getRoomById(this.selectedRoom.id).then((room) => {
            this.selectedRoom = room;
            this.setStationStatusData();
          });
        }
      }, 1000);
    });
  }

  ngOnDestroy(): void {}
}
