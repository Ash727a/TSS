import { Component } from '@angular/core';
import { TelemetryData } from '@core/interfaces';

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.scss'],
})

export class TelemetryComponent {
  telemetryData: TelemetryData = {} as TelemetryData;
  constructor() {}
}
