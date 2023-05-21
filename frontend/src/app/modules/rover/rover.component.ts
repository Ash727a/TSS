import { Component, Input } from '@angular/core';
import { Room, RoverData } from '@app/core/interfaces';
// Backend
import { RoomsService } from '@services/api/rooms.service';
import { RoverService } from '@app/services/api/rover.service';
import { DevicesService } from '@services/api/devices.service';

const POLL_INTERVAL = 1000;
const TEMP_FIX = true;
@Component({
  selector: 'app-rover',
  templateUrl: './rover.component.html',
  styleUrls: ['./rover.component.scss'],
  providers: [RoomsService, RoverService, DevicesService],
})
export class RoverComponent {
  @Input() public variant: 'default' | 'small' = 'default';
  @Input() selectedRoom: Room | null = null;

  protected readonly ROVER_IMG_PATH = 'assets/rover.png'; // Path is relative to "/app" root
  protected commandName: string = '';
  protected commandDetails: string = '';
  protected commandTimeSince: string = '';
  protected roverData: RoverData = {} as RoverData;
  protected connected: boolean = false;
  private pollRoverInterval?: ReturnType<typeof setTimeout>;

  constructor(private roomsService: RoomsService, private roverService: RoverService, private devicesService: DevicesService) { }

  ngOnInit() {
    // On init fetch the room assigned to GEO
    this.roomsService.getRoomByStationName('ROV').then((result) => {
      this.selectedRoom = result;
      if (TEMP_FIX) {
        this.refreshData();
      } else {
        this.pollRoverData();
      }
    });
  }

  private async pollRoverData() {
    this.pollRoverInterval = setInterval(async () => {
    if (!this.selectedRoom || !this.selectedRoom.id) {
      return;
    }
    const roomID = this.selectedRoom?.id;
    // Updates the rover's assigned room in the database under rover table
    this.devicesService.updateRoverAssignedRoom(roomID);
    // Get the rover's data from the database
    const result = await this.roverService.getRoverStateByRoomID(roomID);
    if (result.ok) {
      this.roverData = result.data;
      const roverResult = await this.devicesService.getDeviceByName('rover');
      if (roverResult.ok) {
        const roverDevice = roverResult.data;
        this.connected = Boolean(roverDevice.is_connected);
        if (this.roverData?.updatedAt) {
          const lastUpdate = new Date(this.roverData.updatedAt);
          this.commandName = this.roverData?.cmd ?? '';
          this.commandDetails = this.roverData?.goal_lat || this.roverData?.goal_lon ? `(${this.roverData?.goal_lat}, ${this.roverData?.goal_lon})` : '';
          this.commandTimeSince = this.getDurationDisplay(lastUpdate, new Date());
        }
      }
    }
    }, POLL_INTERVAL);
  }

  private async refreshData() {
    if (!this.selectedRoom || !this.selectedRoom.id) {
      return;
    }
    const roomID = this.selectedRoom?.id;
    // Updates the rover's assigned room in the database under rover table
    this.devicesService.updateRoverAssignedRoom(roomID);
    // Get the rover's data from the database
    const result = await this.roverService.getRoverStateByRoomID(roomID);
    if (result.ok) {
      this.roverData = result.data;
      const roverResult = await this.devicesService.getDeviceByName('rover');
      if (roverResult.ok) {
        const roverDevice = roverResult.data;
        this.connected = Boolean(roverDevice.is_connected);
        if (this.roverData?.updatedAt) {
          const lastUpdate = new Date(this.roverData.updatedAt);
          this.commandName = this.roverData?.cmd ?? '';
          this.commandDetails = this.roverData?.goal_lat || this.roverData?.goal_lon ? `(${this.roverData?.goal_lat}, ${this.roverData?.goal_lon})` : '';
          this.commandTimeSince = this.getDurationDisplay(lastUpdate, new Date());
        }
      }
    }
  }

  private getDurationDisplay(time1: Date, time2: Date): string {
    const timeDiff = time2.getTime() - time1.getTime();
    const durationDisplay = new Date(timeDiff).toISOString().slice(14, 19);
    return durationDisplay;
  }

  public dropdownVisibilityChanged(event: any) {
    const { type, room } = event;
    if (type === 'close' && room) {
      this.selectedRoom = room;
    }
  }

  protected async stopRover(): Promise<void> {
    console.log('Stopping rover');
    if (!this.selectedRoom || !this.selectedRoom.id) {
      return;
    }
    const payload = {
      cmd: 'stop',
      goal_lat: 0,
      goal_lon: 0
    }
    await this.roverService.updateByRoomID(this.selectedRoom.id, payload);
  }

  protected toggleNavigationComplete() {
    if (!this.selectedRoom || !this.selectedRoom.id) {
      return;
    }
    const payload = {
      navigation_status: this.roverData.navigation_status === 'NOT_NAVIGATING' ? 'NAVIGATING' : 'NOT_NAVIGATING'
    }
    this.roverService.updateByRoomID(this.selectedRoom.id, payload).then(() => {
      this.refreshData();
    });
  }
}
