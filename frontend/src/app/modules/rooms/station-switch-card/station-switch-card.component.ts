import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Room } from '@app/core/interfaces';
@Component({
  selector: 'app-rooms-station-switch-card',
  templateUrl: './station-switch-card.component.html',
  styleUrls: ['./station-switch-card.component.scss'],
})
export class StationSwitchCardComponent implements OnInit, OnDestroy {
  @Input() selectedRoom: Room | null = null;

  protected stations: any = [
    { value: 'UIA', isActive: false },
    { value: 'GEO', isActive: false },
    { value: 'ROV', isActive: false },
  ];

  ngOnInit(): void {
    for (let i: number = 0; i < this.stations.length; i++) {
      this.stations[i].time = '00:00';
      if (this.selectedRoom?.stationName === this.stations[i].value) {
        this.stations[i].isActive = true;
        this.stations[i].status = 'current';
      } else {
        this.stations[i].isActive = false;
        this.stations[i].status = 'incomplete';
      }
    }
  }

  ngOnDestroy(): void {}
}
