import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Room } from '@app/core/interfaces';
// Backend
import { RoomsService } from '@services/api/rooms.service';

@Component({
  selector: 'app-rooms-station-switch-card',
  templateUrl: './station-switch-card.component.html',
  styleUrls: ['./station-switch-card.component.scss'],
})
export class StationSwitchCardComponent implements OnInit, OnDestroy {
  @Input() selectedRoom: Room | null = null;

  constructor(private roomsService: RoomsService) {}

  protected stations: any = [
    { value: 'UIA', isActive: false },
    { value: 'GEO', isActive: false },
    { value: 'ROV', isActive: false },
  ];

  ngOnInit(): void {
    this.setStationStatusData();
  }

  private setStationStatusData(): void {
    for (let i: number = 0; i < this.stations.length; i++) {
      this.stations[i].time = '00:00';
      if (this.selectedRoom?.station_name === this.stations[i].value) {
        this.stations[i].isActive = true;
        this.stations[i].status = 'current';
      } else {
        this.stations[i].isActive = false;
        this.stations[i].status = 'incomplete';
      }
    }
  }

  protected handleStationChange(eventType: 'ASSIGN' | 'UNASSIGN', stationString: 'UIA' | 'GEO' | 'ROV') {
    if (!this.selectedRoom) return;
    let station_name: any = stationString;
    if (eventType === 'UNASSIGN') {
      station_name = '';
    } else {
      // Prevents multiple rooms being assigned to the same station
      this.roomsService.unassignPreviouslyAssignedRoom(station_name);
    }
    const payload = {
      ...this.selectedRoom,
      station_name,
    };
    this.roomsService.updateRoomById(this.selectedRoom.id, payload).then((result) => {
      if (result.ok && this.selectedRoom) {
        this.roomsService.getRoomById(this.selectedRoom.id).then((room) => {
          this.selectedRoom = room;
          this.setStationStatusData();
        });
      }
    });
  }

  ngOnDestroy(): void {}
}
