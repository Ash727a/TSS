import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Room } from '@app/core/interfaces';
import config from '@app/config';
// Backend
import { RoomsService } from '@services/api/rooms.service';
import { LogsService } from '@services/api/logs.service';

const POLLING_STATION_DURATION_INTERVAL: number = 1000;
const STATION_TIME_THRESHOLDS = config.stationTimes;

const STATIONS_DEFAULT: { value: 'UIA' | 'GEO' | 'ROV', isActive: boolean, time?: string, status: 'current' | 'incomplete' | 'completed', durationColor: 'white' | 'red' | 'yellow' }[] = [
  { value: 'UIA', isActive: false, status: 'incomplete', durationColor: 'white' },
  { value: 'GEO', isActive: false, status: 'incomplete', durationColor: 'white' },
  { value: 'ROV', isActive: false, status: 'incomplete', durationColor: 'white' },
];

// TODO: Turn into enums
// const enum DurationTimeColor { 'white', 'red', 'yellow' };
// const enum StationStatus { 'current', 'incomplete', 'completed' };
// const enum Station { 'UIA', 'GEO', 'ROV' };

@Component({
  selector: 'app-rooms-station-switch-card',
  templateUrl: './station-switch-card.component.html',
  styleUrls: ['./station-switch-card.component.scss'],
  providers: [LogsService],
})
export class StationSwitchCardComponent implements OnInit, OnDestroy {
  @Input() selectedRoom: Room | null = null;

  constructor(private roomsService: RoomsService, private logsService: LogsService) { }

  protected stations: { value: 'UIA' | 'GEO' | 'ROV', isActive: boolean, time?: string, status: 'current' | 'incomplete' | 'completed', durationColor: 'white' | 'red' | 'yellow' }[] = STATIONS_DEFAULT;

  ngOnInit(): void {
    this.setStationStatusData();
    this.pollStationDurationInterval();
  }

  private refreshData(): void {
    this.stations = STATIONS_DEFAULT;
  }

  private setStationStatusData(): void {
    for (let i: number = 0; i < this.stations.length; i++) {
      this.stations[i].time = '00:00';
      if (this.selectedRoom?.station_name === this.stations[i].value) {
        this.stations[i].isActive = true;
        this.stations[i].status = 'current';
      } else {
        this.stations[i].isActive = false;
        this.stations[i].status = 'incomplete';
      }
    }
  }

  private pollStationDurationInterval(): void {
    setInterval(() => {
      // Fetch the station log of the current assigned station to get the time
      if (this.selectedRoom?.station_log_id) {
        this.logsService.getStationLogByID(this.selectedRoom.station_log_id).then((result: any) => {
          if (result.ok) {
            const stationLog = result.payload;
            if (stationLog.end_time) {
              if (config.VERBOSE) {
                console.log('Skipping station assignment heartbeat because station log already has an end time');
              }
              return;
            }
            const time = new Date(stationLog.start_time).getTime();
            const now = new Date().getTime();
            const timeDiff = now - time;
            // Change to slice(11,19) if you want HH:MM:SS, or slice(14,19) if you want MM:SS
            const durationDisplay = new Date(timeDiff).toISOString().slice(14, 19);
            // Change the color of the duration if it is over the threshold
            let _durationColor: any = 'white';
            if (this.selectedRoom) {
              const thresholds: any = STATION_TIME_THRESHOLDS[this.selectedRoom.station_name];
              // Check red first, since it's the greater threshold
              if (this.shouldColor(thresholds.red, durationDisplay)) {
                _durationColor = 'red';
                // Check yellow next, since it's the lesser threshold
              } else if (this.shouldColor(thresholds.yellow, durationDisplay)) {
                _durationColor = 'yellow';
              }
            }
            // Find the station that is currently active and update the time
            for (let i: number = 0; i < this.stations.length; i++) {
              if (this.stations[i].status === 'current') {
                this.stations[i].time = durationDisplay;
                this.stations[i].durationColor = _durationColor;
              } else {
                this.stations[i].durationColor = 'white';
              }
            }
          }
        });
      }
    }, POLLING_STATION_DURATION_INTERVAL);
  }

  private shouldColor(threshold: string, timeDisplay: string): boolean {
    const currentMinutes = parseInt(timeDisplay.slice(0, 2));
    const currentSeconds = parseInt(timeDisplay.slice(3, 5));
    const thresholdMinutes = parseInt(threshold.slice(0, 2));
    const thresholdSeconds = parseInt(threshold.slice(3, 5));
    // If it's the same minute, check the seconds, if it's greater than the threshold, return true
    if (currentMinutes === thresholdMinutes && currentSeconds >= thresholdSeconds) {
      return true;
      // The current minute is greater than the threshold, return true
    } else if (currentMinutes > thresholdMinutes) {
      return true;
    }
    // Returns false if it doesn't meet the threshold
    return false;
  }

  protected handleStationChange(eventType: 'ASSIGN' | 'UNASSIGN', stationString: 'UIA' | 'GEO' | 'ROV') {
    if (!this.selectedRoom) return;
    // Refresh the frontend component on station change
    this.refreshData();
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
            if (this.selectedRoom) {
              // Since we're refetching room data, it doesn't have any added attributes (from rooms.component.ts) so we manually assign them here
              // We can assume that the status of the room is running, because we can only assign/unassign stations when the room is telemetry is running
              this.selectedRoom.status = 'green';
            }
            this.setStationStatusData();
          });
        }
      }, 1000);
    });
  }

  ngOnDestroy(): void { }
}
