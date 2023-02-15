import { Component, Input, SimpleChanges } from '@angular/core';
import { ValueSensor, TelemetryData } from '@core/interfaces';

@Component({
  selector: 'app-telemetry-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss'],
})
export class StateComponent {
  @Input() telemetryData: TelemetryData = {} as TelemetryData;

  sensors1: ValueSensor[] = [];
  sensors2: ValueSensor[] = [];

  constructor() {
    this.mapTelemetryDataToTable();
    // Even out the rows for each table (fill with blank space until both are equal)
    if (this.sensors1.length > this.sensors2.length) {
      while (this.sensors1.length > this.sensors2.length) {
        this.sensors2.push({ name: '', value: '' });
      }
    } else {
      while (this.sensors2.length > this.sensors1.length) {
        this.sensors1.push({ name: '', value: '' });
      }
    }
  }

  mapTelemetryDataToTable() {
    this.sensors1 = [
      { name: 'Primary Oxygen', value: this.translateDataToDisplayString(this.telemetryData.ox_primary, '%') },
      { name: 'Secondary Oxygen', value: this.translateDataToDisplayString(this.telemetryData.ox_secondary, '%') },
      { name: 'Suit Pressure', value: this.translateDataToDisplayString(this.telemetryData.p_suit, 'psia') },
      { name: 'Sub Pressure', value: this.translateDataToDisplayString(this.telemetryData.p_sub, 'psia') },
      { name: 'O2 Pressure', value: this.translateDataToDisplayString(this.telemetryData.p_o2, 'psia') },
      { name: 'O2 Rate', value: this.translateDataToDisplayString(this.telemetryData.rate_o2, 'psi/min') },
      { name: 'H2O Gas Pressure', value: this.translateDataToDisplayString(this.telemetryData.p_h2o_g, 'psia') },
      { name: 'H2O Liquid Pressure', value: this.translateDataToDisplayString(this.telemetryData.p_h2o_l, 'psia') },
      { name: 'SOP Pressure', value: this.translateDataToDisplayString(this.telemetryData.p_sop, 'psia') },
      { name: 'SOP Rate', value: this.translateDataToDisplayString(this.telemetryData.rate_sop, 'psi/min') },
    ];

    this.sensors2 = [
      { name: 'EVA Time', value: this.translateDataToDisplayString(this.telemetryData.timer, '') },
      { name: 'Heart Rate', value: this.translateDataToDisplayString(this.telemetryData.heart_bpm, 'bpm') },
      { name: 'Fan Tachometer', value: this.translateDataToDisplayString(this.telemetryData.v_fan, 'rpm') },
      { name: 'Battery Capacity', value: this.translateDataToDisplayString(this.telemetryData.cap_battery, 'amp-hr') },
      { name: 'Temperature', value: this.translateDataToDisplayString(this.telemetryData.t_sub, 'deg F') },
      { name: 'Battery Time Left', value: this.translateDataToDisplayString(this.telemetryData.t_battery, '') },
      { name: 'O2 Time Left', value: this.translateDataToDisplayString(this.telemetryData.t_oxygen, '') },
      { name: 'H2O Left', value: this.translateDataToDisplayString(this.telemetryData.t_water, '') },
    ];
  }

  translateDataToDisplayString(data: any, metricSuffix: string = '') {
    return data ? `${data} ${metricSuffix}` : '-';
  }

  // Detects when the telemetry data changes
  ngOnChanges(changes: SimpleChanges) {
    this.telemetryData = changes['telemetryData'].currentValue as TelemetryData;
    this.mapTelemetryDataToTable();
  }
}
