import { Subscription } from 'rxjs';

import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import {
  ModalEvent,
  Room,
  SimulationError,
  SimulationErrorData,
  SimulationErrorKey,
  TelemetryData,
} from '@core/interfaces';
import { RoomsService } from '@services/api/rooms.service';
import { ServerService } from '@services/api/server.service';
import { TelemetryService } from '@services/api/telemetry.service';
import { ModalService } from '@services/modal/modal.service';
import { UsersService } from '@app/services/api/users.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
  providers: [ModalService, RoomsService, UsersService, TelemetryService],
})
export class RoomsComponent implements OnInit, OnDestroy {
  private static readonly POLL_ROOM_STATUS_INTERVAL: number = 3000; // The rate at which the simulation data is fetched from the backend
  private pollRoomStatusInterval!: ReturnType<typeof setTimeout>; // Internal simulation timer
  protected readonly MODAL_VARIANT: 'small' | 'default' = 'small';
  protected loaded: boolean = false;
  private backendConnected = false;
  public rooms: Room[] = [];
  public selectedRoom: Room | null = null;
  protected modalOpen: boolean = false;

  @ViewChild('modal', { read: ViewContainerRef }) private entry!: ViewContainerRef;
  private sub!: Subscription;

  @ViewChild('modal') private modalContentRef!: TemplateRef<any>;

  constructor(
    private serverService: ServerService,
    private modalService: ModalService,
    private roomsService: RoomsService,
    private usersService: UsersService,
    private telemetryService: TelemetryService,
  ) {
    this.serverService.onConnectionStatusChange.subscribe((status: { current: boolean; previous: boolean }) => {
      this.backendConnected = status.current;
      const previouslyConnected = status.previous;
      if (this.backendConnected) {
        // If not previously connected, then restore simulations by re-initializing the ones "running" in the DB
        if (!previouslyConnected) {
          this.telemetryService.restoreSimulations().then((res) => {
            if (res.ok) {
              console.log('Restored simulations');
            }
          });
        }
        this.roomsService
          .getRooms()
          .then((res) => {
            if (res.ok) {
              this.rooms = res.payload;
            }
          })
          .finally(() => {
            this.loaded = true;
          });
        this.startPollRoomStatus();
      }
    });
  }

  ngOnInit(): void {
    if (this.backendConnected) {
      this.roomsService
        .getRooms()
        .then((res) => {
          if (res.ok) {
            this.rooms = res.payload;
          }
        })
        .finally(() => {
          this.loaded = true;
        });
    }
    this.refreshRoomData();
    this.startPollRoomStatus();
  }

  private startPollRoomStatus(): void {
    this.pollRoomStatusInterval = setInterval(() => {
      if (this.backendConnected) {
        this.refreshRoomData();
      }
    }, RoomsComponent.POLL_ROOM_STATUS_INTERVAL);
  }

  private async refreshRoomData(): Promise<void> {
    const _roomsRes = await this.roomsService.getRooms();
    if (!_roomsRes.ok) {
      console.log('Not connected to backend');
      this.backendConnected = false;
      return;
    }
    const _rooms: Room[] = _roomsRes.payload;
    const _errors: SimulationErrorData[] = await this.telemetryService.getAllSimulationErrors();
    const _telemetry: TelemetryData[] = await this.telemetryService.getAllRoomTelemetry();
    // Update all the room data with the latest data from the backend
    const newRooms = _rooms.map(async (room: Room): Promise<Room> => {
      const station_name: string = _rooms.filter((data: Room) => data.id === room.id)[0].station_name;
      const isRunning: boolean = _telemetry.filter((data: TelemetryData) => data.room_id === room.id)[0].is_running;
      const isPaused: boolean = _telemetry.filter((data: TelemetryData) => data.room_id === room.id)[0].is_paused;
      let errors: SimulationError[] = [
        { key: SimulationErrorKey.O2_ERROR, name: 'O2', value: false },
        { key: SimulationErrorKey.PUMP_ERROR, name: 'PUMP', value: false },
        { key: SimulationErrorKey.FAN_ERROR, name: 'FAN', value: false },
        { key: SimulationErrorKey.POWER_ERROR, name: 'POWER', value: false },
      ];
      for (const error of errors) {
        let errorKey: SimulationErrorKey = error.key;
        // Subtract by 1 because the room id starts at 1, but the array index starts at 0
        const roomErrorObject: SimulationErrorData = _errors[room.id - 1];
        if (roomErrorObject.room_id === room.id && (roomErrorObject as any)[errorKey]) {
          error.value = (roomErrorObject as any)[errorKey] ?? false;
        }
      }
      room.errors = errors;
      room.status = isPaused ? 'yellow' : isRunning ? 'green' : 'gray';
      room.station_name = station_name;
      const res = this.usersService.getUserByID(room.user_guid).then(async (res) => {
        if (res.ok) {
          const user = res.data;
          room.userConnected = Boolean(user.hmd_is_connected);
        } else {
          console.error('Failed to connect to fetch user HMD connection status', res.err);
        }
        return room;
      });
      return res;
    });
    this.rooms = await Promise.all(newRooms);
  }

  protected openModal(room: Room): void {
    this.modalOpen = true;
    this.selectedRoom = room;
    // Wait a little bit for a HTML to update so the correct data is displayed in the modal
    setTimeout(() => {
      this.sub = this.modalService.openModal(this.entry, this.modalContentRef).subscribe((v: string) => {
        if (v === ModalEvent.CLOSE) {
          this.selectedRoom = null;
          this.modalOpen = false;
        }
      });
    }, 100);
  }

  protected dropdownVisibilityChanged(event: any): void {
    const { type } = event;
    if (type === ModalEvent.CLOSE) {
      this.refreshRoomData();
    }
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub?.unsubscribe();
      this.selectedRoom = null;
      this.modalOpen = false;
    }
    clearInterval(this.pollRoomStatusInterval);
  }
}
