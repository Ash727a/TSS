import { Component } from '@angular/core';
import { TelemetryData, Room } from '@core/interfaces';

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.scss'],
})

export class TelemetryComponent {
  telemetryData: TelemetryData = {} as TelemetryData;
  selectedRoom: Room = { id: 1 } as Room;

  constructor() {}
}
