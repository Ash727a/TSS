import { Component, Input } from '@angular/core';
import { TelemetryData, Room } from '@core/interfaces';
// Backend
import { RoomsService } from '@services/api/rooms.service';

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.scss'],
  providers: [RoomsService],
})
export class TelemetryComponent {
  @Input() selectedRoom: Room | null = null;
  telemetryData: TelemetryData = {} as TelemetryData;

  constructor(private roomService: RoomsService) {
    
  }

  ngOnInit() {
    // If no room is selected, get Room 1 data and default to Room 1
    if (this.selectedRoom === null) {
      this.roomService.getRoomById(1).then((result) => {
        this.selectedRoom = result;
        this.telemetryData = result.telemetryData;
      });
    }
  }
}
