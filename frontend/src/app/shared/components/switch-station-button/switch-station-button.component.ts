import { Subscription } from 'rxjs';

import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Room } from '@app/core/interfaces';
// Backend
import { RoomsService } from '@services/api/rooms.service';
import { ModalService } from '@services/modal/modal.service';



/** | EXAMPLE USAGE |
  <app-shared-switch-station-button
    (click)="$event.stopPropagation()" // (Optional) If the component is nested inside a clickable, prevent the parent's click event
    [selectedRoom]="selectedRoom"      // (Optional) Will set the currently selected room
    [rooms]="rooms"                    // *REQUIRED* Array of rooms    
    [room]="room"                      // *REQUIRED* Room type which is the current room
    (changeEvent)="dropdownVisibilityChanged($event)" // (Optional) Event emitted when the dropdown is opened or closed
    [disabledDropdown]="modalOpen"     // (Optional) If the dropdown should be disabled
    />
 */

@Component({
  selector: 'app-shared-switch-station-button',
  templateUrl: './switch-station-button.component.html',
  styleUrls: ['./switch-station-button.component.scss'],
})
export class SwitchStationButtonComponent implements OnInit, OnDestroy {
  @Input() public rooms: Room[] = [];
  @Input() public room: Room | null = null;
  @Input() public disabledDropdown: boolean = false;
  @Output() private changeEvent: EventEmitter<object> = new EventEmitter<object>();

  protected selectedRoom: Room | null = null;
  protected dropdownOpen = false;
  protected stations = [
    { value: 'UIA', isActive: false },
    { value: 'GEO', isActive: false },
    { value: 'ROV', isActive: false },
  ];

  @ViewChild('dropdown', { read: ViewContainerRef }) private dropdownEntry!: ViewContainerRef;
  private dropdownSub!: Subscription;

  @ViewChild('dropdown') private dropdownContentRef!: TemplateRef<any>;

  constructor(private modalService: ModalService, private roomsService: RoomsService) {}

  ngOnInit(): void {}

  protected openDropdown(room: Room | null) {
    if (!room || this.disabledDropdown) return;
    this.selectedRoom = room;
    for (const station of this.stations) {
      station.isActive = station.value === room.station_name;
    }
    const payload = {
      type: 'open',
    };
    this.changeEvent.emit(payload);
    // Wait a little bit for a HTML to update so the correct data is displayed in the modal
    setTimeout(() => {
      this.dropdownOpen = true;
      this.dropdownSub = this.modalService
        .openModal(this.dropdownEntry, this.dropdownContentRef, false)
        .subscribe((v) => {
          if (v === 'close') {
            this.selectedRoom = null;
            this.dropdownOpen = false;
            const payload = {
              type: 'close',
            };
            this.changeEvent.emit(payload);
          }
        });
    }, 100);
  }

  protected closeDropdown(event: any) {
    const { type, index } = event;
    if (this.selectedRoom && type === 'close') {
      const station_name = index !== 0 ? this.stations[index].value : '';
      this.handleStationSwitch(station_name);
    }
    this.selectedRoom = null;
    this.dropdownOpen = false;
    this.modalService.closeModal();
    const payload = {
      type: 'close',
    };
    this.changeEvent.emit(payload);
  }

  // TODO Refactor this into RoomsService after creating an API for finding the previously assigned room to that station
  private handleStationSwitch(station_name: string) {
    if (!this.selectedRoom) {
      return;
    }
    // // Prevents multiple rooms being assigned to the same station
    // this.roomsService.unassignPreviouslyAssignedRoom(station_name);
    // // Assign the room to the station
    // const payload = {
    //   ...this.selectedRoom,
    //   station_name,
    // };
    // this.roomsService.updateRoomById(this.selectedRoom.id, payload);
    this.roomsService.updateEVASimulationRoomStation(this.selectedRoom.id, station_name);
  }

  ngOnDestroy(): void {
    if (this.dropdownSub) {
      this.dropdownSub?.unsubscribe();
      this.selectedRoom = null;
      this.dropdownOpen = false;
    }
  }
}
