import { Component, Input } from '@angular/core';
import { Room, RoverData } from '@app/core/interfaces';
// Backend
import { RoomsService } from '@services/api/rooms.service';
import { RoverService } from '@services/api/rover.service';

const POLL_INTERVAL = 1000;
@Component({
  selector: 'app-rover',
  templateUrl: './rover.component.html',
  styleUrls: ['./rover.component.scss'],
  providers: [RoomsService, RoverService],
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

  constructor(private roomsService: RoomsService, private roverService: RoverService) { }

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
    setInterval(() => {
      const roomID = this.selectedRoom?.id ?? 1;
      this.roverService.getRoverStateByRoomID(roomID).then((result) => {
        if (result.ok) {
          this.roverData = result.data;
          this.connected = Boolean(this.roverData?.started_at);
          // Check time since the last update time, and if greater than 5 seconds, set connected to false in frontend and database
          if (this.connected && this.roverData?.updatedAt) {
            const lastUpdate = new Date(this.roverData.updatedAt);
            this.commandName = this.roverData?.cmd ?? '';
            this.commandDetails = this.roverData?.goal_lat || this.roverData?.goal_lon ? `(${this.roverData?.goal_lat}, ${this.roverData?.goal_lon})` : '';
            this.commandTimeSince = this.getDurationDisplay(lastUpdate, new Date());
            // const now = new Date();
            // const diff = now.getTime() - lastUpdate.getTime();
            // if (diff > 5000) {
            //   this.connected = false;
            //   // Set started_at to null in database. This will mark the UIA as not connected to the room
            //   this.roverService.updateByRoomID(roomID, { ...result.data, started_at: null })
            // }
          }
        }
      });
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
