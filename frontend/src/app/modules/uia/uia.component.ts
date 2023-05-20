import { Component, Input } from '@angular/core';
import { Room, StatusSensor, UIAData } from '@app/core/interfaces';
import config from '@app/config';
// Backend
import { RoomsService } from '@services/api/rooms.service';
import { UIAService } from '@services/api/uia.service';

const POLL_INTERVAL = 1000;
@Component({
  selector: 'app-uia',
  templateUrl: './uia.component.html',
  styleUrls: ['./uia.component.scss'],
  providers: [RoomsService, UIAService],
})
export class UIAComponent {
  @Input() public variant: 'default' | 'small' = 'default';
  @Input() selectedRoom: Room | null = null;

  protected TEST_MODE = config.TEST_MODE;
  protected sensors1: StatusSensor[] = [];
  protected sensors2: StatusSensor[] = [];
  private uiaData: UIAData = {} as UIAData;
  protected uiaTelemetry: any = {};
  protected connected: boolean = false;

  constructor(private roomsService: RoomsService, private uiaService: UIAService) { }

  ngOnInit() {
    // If no room is selected, get Room 1 data and default to Room 1
    if (this.selectedRoom === null) {
      this.roomsService.getRoomById(1).then((result) => {
        this.selectedRoom = result;
        this.pollUIAData();
      });
    } else {
      this.pollUIAData();
    }
  }

  private pollUIAData() {
    setInterval(() => {
      const roomID = this.selectedRoom?.id ?? 1;
      this.uiaService.getUIAStateByRoomID(roomID).then((result) => {
        if (result.ok) {
          this.uiaData = result.data;
          if (!this.TEST_MODE) {
            this.connected = Boolean(this.uiaData?.started_at);
            // Check time since the last update time, and if greater than 5 seconds, set connected to false in frontend and database
            if (this.connected && this.uiaData?.updatedAt) {
              const lastUpdate = new Date(this.uiaData.updatedAt);
              const now = new Date();
              const diff = now.getTime() - lastUpdate.getTime();
              if (diff > 5000) {
                this.connected = false;
                // Set started_at to null in database. This will mark the UIA as not connected to the room
                this.uiaService.updateByRoomID(roomID, { ...result.data, started_at: null })
              }
            }
          } else {
            this.connected = true;
          }
          this.sensors1 = [
            { name: 'EMU1 POWER', status: this.setSwitchStatus(this.uiaData?.emu1_pwr_switch), key: 'emu1_pwr_switch' },
            { name: 'EV1 SUPPLY', status: this.setSwitchStatus(this.uiaData?.ev1_supply_switch), key: 'ev1_supply_switch' },
            { name: 'EV1 WASTE', status: this.setSwitchStatus(this.uiaData?.ev1_water_waste_switch), key: 'ev1_water_waste_switch' },
            { name: 'EV1 OXYGEN', status: this.setSwitchStatus(this.uiaData?.emu1_o2_supply_switch), key: 'emu1_o2_supply_switch' },
            { name: 'O2 VENT', status: this.setSwitchStatus(this.uiaData?.o2_vent_switch), key: 'o2_vent_switch' },
          ];

          this.sensors2 = [
            { name: 'EMU2 POWER', status: this.setSwitchStatus(this.uiaData?.emu2_pwr_switch), key: 'emu2_pwr_switch' },
            { name: 'EV2 SUPPLY', status: this.setSwitchStatus(this.uiaData?.ev2_supply_switch), key: 'ev2_supply_switch' },
            { name: 'EV2 WASTE', status: this.setSwitchStatus(this.uiaData?.ev2_water_waste_switch), key: 'ev2_water_waste_switch' },
            { name: 'EV2 OXYGEN', status: this.setSwitchStatus(this.uiaData?.emu2_o2_supply_switch), key: 'emu2_o2_supply_switch' },
            { name: 'DEPRESS PUMP', status: this.setSwitchStatus(this.uiaData?.depress_pump_switch), key: 'depress_pump_switch' },
          ];

          // Get UIA telemetry data
          this.uiaService.getUIATelemetryByRoomID(roomID).then((result) => {
            if (result.ok) {
              this.uiaTelemetry = result.data;
            }
          }
          );
        }
      });
    }, POLL_INTERVAL);
  }

  private setSwitchStatus(status: boolean): boolean | undefined {
    // If not connected to this room, return undefined by default
    if (!this.connected) {
      return undefined;
    }
    // Else set to the boolean value
    return status ?? undefined;
  }

  public dropdownVisibilityChanged(event: any) {
    const { type, room } = event;
    if (type === 'close' && room) {
      this.selectedRoom = room;
    }
  }

  protected toggleUIASwitch(sensor: any) {
    const payload = {
      ...this.uiaData,
      [sensor.key]: !sensor.status,
    }
    if (this.selectedRoom?.id === undefined) {
      return;
    }
    this.uiaService.updateByRoomID(this.selectedRoom.id, payload);
  }
}
