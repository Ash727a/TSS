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
  private modalOpen: boolean = false;
  protected selectedRoom: Room | null = null;

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
      .then((result) => {
        this.rooms = result;
      })
      .catch((e) => {
        console.warn(e);
      }).finally(() => {
        this.loaded = true;
      });
    this.startPollRoomStatus();
  }

  private startPollRoomStatus() {
    this.pollRoomStatusInterval = setInterval(() => {
      this.telemetryService.getAllRoomTelemetry().then((result) => {
        // match all rooms by their room id and filter out only their isRunning status
        this.rooms = this.rooms.map((room) => {
          let isRunning = result.filter((data: { id: number }) => data.id === room.id)[0].isRunning;
          room.status = isRunning ? 'green' : 'gray';
          return room;
        });
      });
    }, RoomsComponent.POLL_ROOM_STATUS_INTERVAL);
  }

  protected openModal(room: Room) {
    this.selectedRoom = room;
    // Wait a little bit for a HTML to update so the correct data is displayed in the modal
    setTimeout(() => {
      this.sub = this.modalService.openModal(this.entry, this.modalContentRef).subscribe((v) => {
        // Logic here
      });
      this.modalOpen = true;
    }, 100);
  }
  
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
      this.modalOpen = false;
      this.selectedRoom = null;
    }
    clearInterval(this.pollRoomStatusInterval);
  }

  protected switch() {
    console.log('switch clicked');
  }
}
