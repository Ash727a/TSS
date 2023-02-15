import { Component, Input } from '@angular/core';
import { TelemetryData, Room } from '@core/interfaces';

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.scss'],
})

export class TelemetryComponent {
  @Input() selectedRoom: Room | null = null;
  telemetryData: TelemetryData = {} as TelemetryData;

  constructor() {
  }
}
