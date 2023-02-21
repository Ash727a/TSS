import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, TemplateRef } from '@angular/core';
import { ModalService } from '@services/modal/modal.service';
import { Subscription } from 'rxjs';
import { Room } from '@core/interfaces';
// Backend
import { RoomsService } from '@services/api/rooms.service';
import { TelemetryService } from '@services/api/telemetry.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
  providers: [ModalService, RoomsService, TelemetryService],
})
export class RoomsComponent implements OnInit, OnDestroy {
  private static readonly POLL_ROOM_STATUS_INTERVAL: number = 3000; // The rate at which the simulation data is fetched from the backend
  private pollRoomStatusInterval!: ReturnType<typeof setTimeout>; // Internal simulation timer
  protected loaded = false;
  protected rooms: Room[] = [];
  protected selectedRoom: Room | null = null;
  protected modalOpen = false;
  protected dropdownOpen = false;
  protected stations = [
    { value: 'UIA', isActive: false },
    { value: 'GEO', isActive: false },
    { value: 'ROV', isActive: false },
  ];

  @ViewChild('modal', { read: ViewContainerRef }) private entry!: ViewContainerRef;
  private sub!: Subscription;

  @ViewChild('modal') private modalContentRef!: TemplateRef<any>;

  @ViewChild('dropdown', { read: ViewContainerRef }) private dropdownEntry!: ViewContainerRef;
  private dropdownSub!: Subscription;

  @ViewChild('dropdown') private dropdownContentRef!: TemplateRef<any>;

  constructor(
    private modalService: ModalService,
    private roomsService: RoomsService,
    private telemetryService: TelemetryService
  ) {}

  ngOnInit(): void {
    this.roomsService
      .getRooms()
      .then((result) => {
        this.rooms = result;
      })
      .catch((e) => {
        console.warn(e);
      })
      .finally(() => {
        this.loaded = true;
      });
    this.refreshRoomData();
    this.startPollRoomStatus();
  }

  private startPollRoomStatus() {
    this.pollRoomStatusInterval = setInterval(() => {
      this.refreshRoomData();
    }, RoomsComponent.POLL_ROOM_STATUS_INTERVAL);
  }

  private refreshRoomData() {
    this.roomsService.getRooms().then((roomsResult) => {
      this.telemetryService.getAllRoomTelemetry().then((telemetryResult) => {
        this.rooms = this.rooms.map((room: any) => {
          let stationName = roomsResult.filter((data: any) => data.id === room.id)[0].stationName;
          let isRunning = telemetryResult.filter((data: { id: number }) => data.id === room.id)[0].isRunning;
          room.status = isRunning ? 'green' : 'gray';
          room.stationName = stationName;
          return room;
        });
      });
    });

      // this.rooms = this.rooms.map((room: any) => {
      //   let stationName = result.filter((data: any) => data.id === room.id)[0].stationName;
      //   room.stationName = stationName;
      //   return room;
      // });
      // })
      // this.telemetryService.getAllRoomTelemetry().then((result) => {
      //   this.rooms = this.rooms.map((room: any) => {
      //     let isRunning = result.filter((data: { id: number }) => data.id === room.id)[0].isRunning;
      //     room.status = isRunning ? 'green' : 'gray';
      //     return room;
      //   });
      // });
  }

  protected openModal(room: Room) {
    if (this.dropdownOpen) {
      return;
    }
    this.modalOpen = true;
    this.selectedRoom = room;
    // Wait a little bit for a HTML to update so the correct data is displayed in the modal
    setTimeout(() => {
      this.sub = this.modalService.openModal(this.entry, this.modalContentRef).subscribe((v) => {
        if (v === 'close') {
          this.selectedRoom = null;
          this.modalOpen = false;
        }
      });
    }, 100);
  }

  protected openDropdown(room: Room) {
    if (this.modalOpen) {
      return;
    }
    this.selectedRoom = room;
    for (const station of this.stations) {
      station.isActive = station.value === room.stationName;
    }
    // Wait a little bit for a HTML to update so the correct data is displayed in the modal
    setTimeout(() => {
      this.dropdownOpen = true;
      this.dropdownSub = this.modalService
        .openModal(this.dropdownEntry, this.dropdownContentRef, false)
        .subscribe((v) => {
          if (v === 'close') {
            this.selectedRoom = null;
            this.dropdownOpen = false;
          }
        });
    }, 100);
  }

  protected closeDropdown(event: any) {
    const { type, index } = event;
    if (this.selectedRoom && type === 'close') {
      const stationName = index !== 0 ? this.stations[index].value : '';
      this.handleStationSwitch(stationName);
    }
    this.selectedRoom = null;
    this.dropdownOpen = false;
    this.modalService.closeModal();
    this.refreshRoomData();
  }

  private handleStationSwitch(stationName: string) {
    if (!this.selectedRoom) {
      return;
    }
    const previousAssignedRoomID = this.rooms.find(
      (room) => room.stationName === stationName &&
                room.id !== this.selectedRoom?.id &&
                room.stationName !== 'None' &&
                room.stationName !== ''
      )?.id ;
    // If the room is already assigned to the station, unassign it
    if (previousAssignedRoomID !== undefined) {
      const payload = {
        id: previousAssignedRoomID,
        stationName: '',
      };
      this.roomsService.updateRoomById(previousAssignedRoomID, payload).then((result) => {
      });
    }
    // Assign the room to the station
    const payload = {
      ...this.selectedRoom,
      stationName,
    };
    this.roomsService.updateRoomById(this.selectedRoom.id, payload).then((result) => {
    });
  }


  ngOnDestroy(): void {
    if (this.sub || this.dropdownSub) {
      this.sub?.unsubscribe();
      this.dropdownSub?.unsubscribe();
      this.selectedRoom = null;
      this.modalOpen = false;
      this.dropdownOpen = false;
    }
    clearInterval(this.pollRoomStatusInterval);
  }

  protected switch() {
    console.log('switch clicked');
  }
}
