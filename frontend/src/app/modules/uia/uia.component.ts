import { Component, Input } from '@angular/core';
import { Room, StatusSensor, UIAData } from '@app/core/interfaces';
// Backend
import { RoomsService } from '@services/api/rooms.service';
import { UIAService } from '@services/api/uia.service';

@Component({
  selector: 'app-uia',
  templateUrl: './uia.component.html',
  styleUrls: ['./uia.component.scss'],
  providers: [RoomsService, UIAService],
})
export class UIAComponent {
  @Input() public variant: 'default' | 'small' = 'default';
  @Input() selectedRoom: Room | null = null;

  protected sensors1: StatusSensor[] = [];
  protected sensors2: StatusSensor[] = [];
  private uiaData: UIAData = {} as UIAData;

  constructor(private roomsService: RoomsService, private uiaService: UIAService) {}

  ngOnInit() {
    // If no room is selected, get Room 1 data and default to Room 1
    if (this.selectedRoom === null) {
      this.roomsService.getRoomById(1).then((result) => {
        this.selectedRoom = result;
      });
    }
    let roomID = this.selectedRoom?.id ?? 1;
    this.uiaService.getUIAStateByRoomID(roomID).then((result) => {
      if (result.ok) {
        this.uiaData = result.data[0];
        // console.log(this.uiaData);
      }
    });
    // console.log(this.uiaData);
    this.sensors1 = [
      { name: 'EMU1', status: this.uiaData?.emu1 ?? undefined },
      { name: 'EV1 SUPPLY', status: this.uiaData?.ev1_supply ?? undefined },
      { name: 'EV1 WASTE', status: this.uiaData?.ev1_waste ?? undefined },
      // { name: 'EV1 OXYGEN', status: this.uiaData?.ev1_O2 ?? undefined },
      { name: 'O2 VENT', status: this.uiaData?.O2_vent ?? undefined },
    ];

    this.sensors2 = [
      { name: 'EMU2', status: this.uiaData?.emu2 ?? undefined },
      { name: 'EV2 SUPPLY', status: this.uiaData?.ev2_supply ?? undefined },
      { name: 'EV2 WASTE', status: this.uiaData?.ev2_waste ?? undefined },
      // { name: 'EV2 OXYGEN', status: this.uiaData?.ev2_O2 ?? undefined },
      { name: 'DEPRESS PUMP', status: this.uiaData?.depress_pump ?? undefined },
    ];
  }

  public dropdownVisibilityChanged(event: any) {
    const { type, room } = event;
    if (type === 'close' && room) {
      this.selectedRoom = room;
    }
  }
}
