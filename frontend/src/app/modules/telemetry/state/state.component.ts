import { Component } from '@angular/core';
import { ValueSensor } from '@core/interfaces';

@Component({
  selector: 'app-telemetry-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss'],
})
export class StateComponent {
  sensors1: ValueSensor[] = [];
  sensors2: ValueSensor[] = [];

  constructor() {
    this.sensors1 = [
      { name: 'Primary Oxygen', value: '-' },
      { name: 'Secondary Oxygen', value: '-' },
      { name: 'Suit Pressure', value: '-' },
      { name: 'Sub Pressure', value: '-' },
      { name: 'O2 Pressure', value: '-' },
      { name: 'O2 Rate', value: '-' },
      { name: 'H2O Gas Pressure', value: '-' },
      { name: 'H2O Liquid Pressure', value: '-' },
      { name: 'SOP Pressure', value: '-' },
      { name: 'SOP Rate', value: '-' },
    ];

    this.sensors2 = [
      { name: 'EVA Time', value: '-' },
      { name: 'Heart Rate', value: '-' },
      { name: 'Fan Tachometer', value: '-' },
      { name: 'Battery Capacity', value: '-' },
      { name: 'Temperature', value: '-' },
      { name: 'Battery Time Left', value: '-' },
      { name: 'O2 Time Left', value: '-' },
      { name: 'H2O Left', value: '-' },
    ];
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
}
