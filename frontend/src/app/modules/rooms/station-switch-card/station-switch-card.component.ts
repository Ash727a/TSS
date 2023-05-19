import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Room } from '@app/core/interfaces';
import config from '@app/config';
// Backend
import { RoomsService } from '@services/api/rooms.service';
import { LogsService } from '@services/api/logs.service';
import { TelemetryService } from '@services/api/telemetry.service';


const POLLING_STATION_DURATION_INTERVAL: number = 1000;
const STATION_TIME_THRESHOLDS = config.stationTimes;

const STATIONS_DEFAULT: { value: 'UIA' | 'GEO' | 'ROV', isActive: boolean, time?: string, status: 'current' | 'incomplete' | 'completed', durationColor: 'white' | 'red' | 'yellow' | 'green' }[] = [
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

  private pollTimer!: ReturnType<typeof setTimeout>;

  constructor(private roomsService: RoomsService, private logsService: LogsService, private telemetryService: TelemetryService) { }

  protected stations: { value: 'UIA' | 'GEO' | 'ROV', isActive: boolean, time?: string, status: 'current' | 'incomplete' | 'completed', durationColor: 'white' | 'red' | 'yellow' | 'green' }[] = [];

  ngOnInit(): void {
    this.refreshData();
    this.setStationStatusData();
    if (!this.pollTimer) {
      this.pollStationDurationInterval();
    }
  }

  private refreshData(): void {
    this.stations = structuredClone(STATIONS_DEFAULT);
  }

  private async setStationStatusData(): Promise<void> {
    // Get the station logs in the DB that have the same simulation_log_id as the current room
    let loggedStations: any[] = await this.getLoggedStations();
    for (let i: number = 0; i < this.stations.length; i++) {
      this.stations[i].time = '00:00';
      const _stationName = this.selectedRoom?.station_name;
      if (_stationName === this.stations[i].value) {
        this.stations[i].isActive = true;
        this.stations[i].status = 'current';
      } else {
        this.stations[i].isActive = false;
        // The station isn't active, so check if the station is completed or not
        if (this.stationIsCompleted(i, this.stations[i].value, loggedStations)) {
          this.stations[i].status = 'completed';
        } else {
          this.stations[i].status = 'incomplete';
        }
      }
    }
  }

  private pollStationDurationInterval(): void {
    this.pollTimer = setInterval(() => {
      if (!this.selectedRoom) {
        return;
      };
      // If the room isn't running, check if the room running state has changed
      this.telemetryService.getTelemetryByRoomID(this.selectedRoom.id).then((result) => {
        if (result.ok && this.selectedRoom) {
          if (result.payload.is_running && !result.payload.is_paused) {
            this.selectedRoom.status = 'green';
          } else {
            this.selectedRoom.status = '';
            this.refreshData();
          }
        }
      });
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
            if (!this.selectedRoom) {
              return;
            }
            // Update the current station's duration
            const currentStationIndex = this.stations.findIndex((station) => station.status === 'current');
            this.updateDurationText(currentStationIndex, new Date(stationLog.start_time), new Date());
          }
        });
      }
    }, POLLING_STATION_DURATION_INTERVAL);
  }

  private updateDurationText(_index: number, startTime: Date, endTime: Date, isCompleted: boolean = false): void {
    if (!this.stations[_index]) {
      return;
    }
    const durationDisplay = this.getDurationDisplay(startTime, endTime);
    // Change the color of the duration if it is over the threshold
    const durationColor = this.getDurationTextColor(this.stations[_index].value, durationDisplay, isCompleted);
    this.stations[_index].time = durationDisplay;
    this.stations[_index].durationColor = durationColor as any;
  }

  private getDurationDisplay(time1: Date, time2: Date): string {
    const timeDiff = time2.getTime() - time1.getTime();
    const durationDisplay = new Date(timeDiff).toISOString().slice(14, 19);
    return durationDisplay;
  }

  private getDurationTextColor(_stationName: string, durationDisplay: string, isCompleted: boolean): string {
    let _durationColor: any = 'white';
    if (this.selectedRoom) {
      const thresholds: any = STATION_TIME_THRESHOLDS[_stationName];
      // Check red first, since it's the greater threshold
      if (this.shouldColor(thresholds.red, durationDisplay)) {
        _durationColor = 'red';
        // If it's completed, then it's green (not active) then we don't need to warn with yellow. It's completed.
      } else if (isCompleted) {
        _durationColor = 'green';
        // Check yellow next, since it's the lesser threshold
      } else if (this.shouldColor(thresholds.yellow, durationDisplay)) {
        _durationColor = 'yellow';
      }
    }
    return _durationColor;
  }

  private shouldColor(threshold: string, timeDisplay: string): boolean {
    // The below parses from MM:SS format
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

  async getLoggedStations(): Promise<any[]> {
    if (!this.selectedRoom || !this.selectedRoom.session_log_id) {
      return [];
    }
    const res: any = await this.logsService.getCompletedStationsBySessionLogID(this.selectedRoom.session_log_id);
    if (res.ok) {
      const completedStations = res.payload;
      return completedStations;
    } else {
      console.log('Error checking for completed stations in this room', res.err);
    }
    return [];
  }

  private stationIsCompleted(stationIndex: number, stationName: string, loggedStations: any[]): boolean {
    for (let i: number = 0; i < loggedStations.length; i++) {
      if (loggedStations[i].station_name === stationName) {
        const isCompleted = Boolean(loggedStations[i].completed);
        this.updateDurationText(stationIndex, new Date(loggedStations[i].start_time), new Date(loggedStations[i].end_time), isCompleted);
        return isCompleted;
      }
    }
    return false;
  }

  ngOnDestroy(): void {
    clearInterval(this.pollTimer);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRoom']) {
      this.selectedRoom = changes['selectedRoom'].currentValue;
    }
  }
}
