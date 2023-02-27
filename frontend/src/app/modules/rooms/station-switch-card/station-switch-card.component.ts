import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-rooms-station-switch-card',
  templateUrl: './station-switch-card.component.html',
  styleUrls: ['./station-switch-card.component.scss'],
})
export class StationSwitchCardComponent implements OnInit, OnDestroy {
  protected stations:any = [
    { value: 'UIA', isActive: false },
    { value: 'GEO', isActive: false },
    { value: 'ROV', isActive: false },
  ];

  ngOnInit(): void {
    for (let i:number = 0; i < this.stations.length; i++) {
      this.stations[i].time = '00:00';
      if (this.stations[i].value === 'UIA') {
        this.stations[i].isActive = true;
        this.stations[i].status = 'current';
      } else if (this.stations[i].value === 'GEO') {
        this.stations[i].status = 'completed';
      } else {
        this.stations[i].status = 'incomplete';
      }
    }
  }

  ngOnDestroy(): void {
  }
}
