import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, TemplateRef } from '@angular/core';
import { ModalService } from '@services/modal/modal.service';
import { Subscription } from 'rxjs';
import {
  Room,
  SimulationError,
  TelemetryData,
  SimulationErrorData,
  ModalEvent,
  SimulationErrorKey,
} from '@app/core/interfaces';
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
  protected loaded: boolean = false;
  public rooms: Room[] = [];
  public selectedRoom: Room | null = null;
  protected modalOpen: boolean = false;

  @ViewChild('modal', { read: ViewContainerRef }) private entry!: ViewContainerRef;
  private sub!: Subscription;

  @ViewChild('modal') private modalContentRef!: TemplateRef<any>;

  constructor(
    private modalService: ModalService,
    private roomsService: RoomsService,
    private telemetryService: TelemetryService
  ) {}

  ngOnInit(): void {
    this.roomsService
      .getRooms()
      .then((result: Room[]) => {
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

  private startPollRoomStatus(): void {
    this.pollRoomStatusInterval = setInterval(() => {
      this.refreshRoomData();
    }, RoomsComponent.POLL_ROOM_STATUS_INTERVAL);
  }

  private refreshRoomData(): void {
    this.roomsService.getRooms().then((roomsResult: Room[]) => {
      this.telemetryService.getAllSimulationErrors().then((errorsResult: SimulationErrorData[]): void => {
        this.telemetryService.getAllRoomTelemetry().then((telemetryResult): void => {
          // Update all the room data with the latest data from the backend
          this.rooms = this.rooms.map((room: Room): Room => {
            let stationName: string = roomsResult.filter((data: Room) => data.id === room.id)[0].stationName;
            let isRunning: boolean = telemetryResult.filter((data: TelemetryData) => data.id === room.id)[0].isRunning;
            let errors: SimulationError[] = [
              { key: SimulationErrorKey.O2_ERROR, name: 'O2', value: false },
              { key: SimulationErrorKey.PUMP_ERROR, name: 'PUMP', value: false },
              { key: SimulationErrorKey.FAN_ERROR, name: 'FAN', value: false },
              { key: SimulationErrorKey.POWER_ERROR, name: 'POWER', value: false },
            ];
            for (const error of errors) {
              let errorKey: SimulationErrorKey = error.key;
              // Subtract by 1 because the room id starts at 1, but the array index starts at 0
              const roomErrorObject: SimulationErrorData = errorsResult[room.id - 1];
              if (roomErrorObject.room === room.id && (roomErrorObject as any)[errorKey]) {
                error.value = (roomErrorObject as any)[errorKey] ?? false;
              }
            }
            room.errors = errors;
            room.status = isRunning ? 'green' : 'gray';
            room.stationName = stationName;
            return room;
          });
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

    // TODO: Separate Later
    // Update the simulator errors
    // this.telemetryService.getAllSimulationErrors().then((result) => {
    // console.log('Errors', result);
    // this.simulationErrorData = result;
    // this.rooms = this.rooms.map((room: any) => {
    //   let stationName = result.filter((data: any) => data.id === room.id)[0].stationName;
    //   room.stationName = stationName;
    //   return room;
    // });
    // });
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
