import { Component, OnInit, OnDestroy, Input } from '@angular/core';
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
      if (this.selectedRoom?.stationName === this.stations[i].value) {
        this.stations[i].isActive = true;
        this.stations[i].status = 'current';
      } else {
        this.stations[i].isActive = false;
        this.stations[i].status = 'incomplete';
      }
    }
  }

  // TODO Refactor this into RoomsService after creating an API for getting all rooms that are assigned
  private unassignPreviouslyAssignedRoom(stationName: string): void {
    let previousAssignedRoomID;
    this.roomsService.getRooms().then((rooms) => {
      previousAssignedRoomID = rooms.find(
        (room: any) =>
          room.stationName === stationName &&
          room.id !== this.selectedRoom?.id &&
          room.stationName !== 'None' &&
          room.stationName !== ''
      )?.id;
      // If the room is already assigned to the station, unassign it
      if (previousAssignedRoomID !== undefined) {
        const payload = {
          id: previousAssignedRoomID,
          stationName: '',
        };
        this.roomsService.updateRoomById(previousAssignedRoomID, payload);
      }
    });
  }

  protected handleStationChange(eventType: 'ASSIGN' | 'UNASSIGN', stationString: 'UIA' | 'GEO' | 'ROV') {
    if (!this.selectedRoom) return;
    let stationName: any = stationString;
    if (eventType === 'UNASSIGN') {
      stationName = '';
    }
    this.unassignPreviouslyAssignedRoom(stationName);
    const payload = {
      ...this.selectedRoom,
      stationName,
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
