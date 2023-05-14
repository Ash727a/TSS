import { Component, Input } from '@angular/core';
import { Room, RoverData } from '@app/core/interfaces';
// Backend
import { RoomsService } from '@services/api/rooms.service';
import { RoverService } from '@services/api/rover.service';
import { DevicesService } from '@services/api/devices.service';

const POLL_INTERVAL = 1000;
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
  private roverData: RoverData = {} as RoverData;
  protected connected: boolean = false;

  constructor(private roomsService: RoomsService, private roverService: RoverService, private devicesService: DevicesService) { }

  ngOnInit() {
    // If no room is selected, get Room 1 data and default to Room 1
    if (this.selectedRoom === null) {
      this.roomsService.getRoomById(1).then((result) => {
        this.selectedRoom = result;
        this.pollRoverData();
      });
    } else {
      this.pollRoverData();
    }
  }

  private pollRoverData() {
    setInterval(async () => {
      const roomID = this.selectedRoom?.id ?? 1;
      const result = await this.roverService.getRoverStateByRoomID(roomID);
      if (result.ok) {
        this.roverData = result.data;
        const roverResult = await this.devicesService.getDeviceByName('rover');
        if (roverResult.ok) {
          const roverDevice = roverResult.data;
          this.connected = Boolean(roverDevice.is_connected);
          if (this.connected && this.roverData?.updatedAt) {
            const lastUpdate = new Date(this.roverData.updatedAt);
            this.commandName = this.roverData?.cmd ?? '';
            this.commandDetails = this.roverData?.goal_lat || this.roverData?.goal_lon ? `(${this.roverData?.goal_lat}, ${this.roverData?.goal_lon})` : '';
            this.commandTimeSince = this.getDurationDisplay(lastUpdate, new Date());
          }
        }
      }
    }, POLL_INTERVAL);
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
}
