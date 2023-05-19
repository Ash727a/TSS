import { Component, Input, SimpleChanges } from '@angular/core';
import { ValueSensor } from '@app/core/interfaces';

export interface UIAData {
  room_id: number;
  emu1_is_booted: boolean;
  uia_supply_pressure: number;
  water_level: number;
  depress_pump_fault: boolean;
  airlock_pressure: number;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-uia-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss'],
})
export class UIAStateComponent {
  private static readonly EMPTY_TEXT_LABEL = '';
  @Input() public variant: 'default' | 'small' = 'default';
  @Input() public uiaTelemetry: UIAData = {} as UIAData;

  protected sensors1: ValueSensor[] = [];
  protected sensors2: ValueSensor[] = [];

  constructor() {
    this.mapTelemetryDataToTable();
  }

  private mapTelemetryDataToTable() {
    this.sensors1 = [
      { name: 'EMU 1 Booted', value: this.translateDataToDisplayString(this.uiaTelemetry?.emu1_is_booted, '') },
      { name: 'UIA Supply Pressure', value: this.translateDataToDisplayString(this.uiaTelemetry?.uia_supply_pressure, 'psia') },
      { name: 'Water Level', value: this.translateDataToDisplayString(this.uiaTelemetry?.water_level, 'gal') },

    ];

    this.sensors2 = [
      { name: 'Depress Pump Fault', value: this.translateDataToDisplayString(this.uiaTelemetry?.depress_pump_fault, '') },
      { name: 'Airlock Pressure', value: this.translateDataToDisplayString(this.uiaTelemetry?.airlock_pressure, 'psia') },
    ];

    // Even out the rows for each table (fill with blank space until both are equal)
    if (this.sensors1.length > this.sensors2.length) {
      while (this.sensors1.length > this.sensors2.length) {
        this.sensors2.push({ name: '', value: UIAStateComponent.EMPTY_TEXT_LABEL });
      }
    } else {
      while (this.sensors2.length > this.sensors1.length) {
        this.sensors1.push({ name: '', value: UIAStateComponent.EMPTY_TEXT_LABEL });
      }
    }
  }

  private translateDataToDisplayString(data: any, metricSuffix: string = '') {
    let displayString = data?.toString().substring(0, 5);
    return data ? `${displayString} ${metricSuffix}` : UIAStateComponent.EMPTY_TEXT_LABEL;
  }

  // Detects when the telemetry data changes
  ngOnChanges(changes: SimpleChanges) {
    this.uiaTelemetry = changes['uiaTelemetry'].currentValue as UIAData;
    this.mapTelemetryDataToTable();
  }
}
