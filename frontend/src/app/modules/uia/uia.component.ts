import { Component, Input } from '@angular/core';
import { Room, StatusSensor } from '@core/interfaces';

@Component({
  selector: 'app-uia',
  templateUrl: './uia.component.html',
  styleUrls: ['./uia.component.scss'],
})
export class UIAComponent {
  sensors1: StatusSensor[] = [];
  sensors2: StatusSensor[] = [];

  @Input() selectedRoom: Room | null = null;

  constructor() {
    this.sensors1 = [
      { name: 'EMU1', status: true },
      { name: 'EV1 SUPPLY', status: true },
      { name: 'EV1 WASTE', status: true },
      { name: 'EV1 OXYGEN', status: true },
      { name: 'O2 VENT', status: true },
    ];

    this.sensors2 = [
      { name: 'EMU2', status: true },
      { name: 'EV2 SUPPLY', status: true },
      { name: 'EV2 WASTE', status: true },
      { name: 'EV2 OXYGEN', status: true },
      { name: 'DEPRESS PUMP', status: true },
    ];
  }
}
