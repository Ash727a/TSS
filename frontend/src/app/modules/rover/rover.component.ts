import { Component, Input } from '@angular/core';
import { Room, RoverData } from '@app/core/interfaces';
// Backend
import { RoomsService } from '@services/api/rooms.service';
import { UIAService } from '@services/api/uia.service';

const POLL_INTERVAL = 1000;
@Component({
  selector: 'app-rover',
  templateUrl: './rover.component.html',
  styleUrls: ['./rover.component.scss'],
  providers: [RoomsService, UIAService],
})
export class RoverComponent {
  @Input() public variant: 'default' | 'small' = 'default';
  @Input() selectedRoom: Room | null = null;

  protected readonly ROVER_IMG_PATH = 'assets/rover.png'; // Path is relative to "/app" root
  protected commandName: string = '';
  protected commandTimeSince: string = '';
  // protected sensors1: StatusSensor[] = [];
  // protected sensors2: StatusSensor[] = [];
  private roverData: RoverData = {} as RoverData;
  protected connected: boolean = false;

  constructor(private roomsService: RoomsService, private uiaService: UIAService) { }

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
      this.uiaService.getUIAStateByRoomID(roomID).then((result) => {
        if (result.ok) {
          this.roverData = result.data;
          // this.connected = Boolean(this.roverData?.started_at);
          // Check time since the last update time, and if greater than 5 seconds, set connected to false in frontend and database
          if (this.connected && this.roverData?.updated_at) {
            const lastUpdate = new Date(this.roverData.updated_at);
            const now = new Date();
            const diff = now.getTime() - lastUpdate.getTime();
            if (diff > 5000) {
              this.connected = false;
              // Set started_at to null in database. This will mark the UIA as not connected to the room
              this.uiaService.updateByRoomID(roomID, { ...result.data, started_at: null })
            }
          }
        }
      });
    }, POLL_INTERVAL);
  }

  public dropdownVisibilityChanged(event: any) {
    const { type, room } = event;
    if (type === 'close' && room) {
      this.selectedRoom = room;
    }
  }
}
