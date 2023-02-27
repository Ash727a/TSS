import { Component, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { TelemetryData, Room, SimulationError, SimulationErrorKey, SimulationErrorData } from '@app/core/interfaces';
// Backend
import { RoomsService } from '@services/api/rooms.service';
import { TelemetryService } from '@services/api/telemetry.service';

@Component({
  selector: 'app-telemetry-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss'],
  providers: [RoomsService, TelemetryService],
})
export class ControllerComponent {
  @Input() public variant: 'default' | 'small' = 'default';
  @Input() public selectedRoom: Room | null = null;
  @Output() public telemetryDataEmitter: EventEmitter<any> = new EventEmitter();

  private static readonly DEFAULT_ROOM_ID: number = 1; // Default room ID if no room is selected
  private static readonly SIMULATION_FETCH_INTERVAL: number = 1000; // The rate at which the simulation data is fetched from the backend
  protected connected: boolean | undefined = undefined; // bool for the room's simulation connection status
  private simulationState: 'start' | 'stop' | '' = ''; // Not really used except locally, used as a string for API method
  protected switches: SimulationError[]; // Array of simulation error switches the CAPCOM can throw in the sim
  private simInterval!: ReturnType<typeof setTimeout>; // Internal simulation timer
  protected telemetryData: TelemetryData = {} as TelemetryData; // Data passed in from the backend of the generated simulation
  protected simulationErrorData: SimulationErrorData = {} as SimulationErrorData;

  constructor(private roomsService: RoomsService, private telemetryService: TelemetryService) {
    this.switches = [
      { key: SimulationErrorKey.O2_ERROR, name: 'O2 ERROR', value: false },
      { key: SimulationErrorKey.PUMP_ERROR, name: 'PUMP ERROR', value: false },
      { key: SimulationErrorKey.FAN_ERROR, name: 'FAN ERROR', value: false },
      { key: SimulationErrorKey.POWER_ERROR, name: 'POWER ERROR', value: false },
    ];
  }

  ngOnInit(): void {
    let roomID: number = this.selectedRoom?.id ?? ControllerComponent.DEFAULT_ROOM_ID;
    // If no room is selected, get Room 1 data and default to Room 1
    if (this.selectedRoom === null) {
      // Get the default room
      this.roomsService.getRoomById(roomID).then((result: Room) => {
        this.selectedRoom = result;
      });
    }
    // Get the telemetry data for the room
    this.telemetryService.getTelemetryByRoomID(roomID).then((result: TelemetryData) => {
      // If the simulation is running, then start fetching and emitting that data from the running simulation
      if (result?.isRunning) {
        this.fetchAndEmitDataOnInterval();
      } else {
        this.connected = false;
      }
    });

    this.telemetryService.getSimulationErrorsByRoomID(roomID).then((result: SimulationErrorData) => {
      // Set the metadata for the switches
      this.simulationErrorData = result;
      // Set the switch values and remove from the metadata object
      for (let i = 0; i < this.switches.length; i++) {
        const keyName: SimulationErrorKey = this.switches[i].key;
        this.switches[i].value = (this.simulationErrorData as any)[keyName];
        delete (this.simulationErrorData as any)[keyName];
      }
    });
  }

  /**
   * Fetches the simulation data from the backend and emits it to the parent component
   */
  private fetchAndEmitDataOnInterval(): void {
    // Start the interval of getting the simulation data then emitting it
    this.simInterval = setInterval(() => {
      this.getSimulationData();
      this.telemetryDataEmitter.emit(this.telemetryData);
    }, ControllerComponent.SIMULATION_FETCH_INTERVAL);
    // Set connected status to true
    this.connected = true;
  }

  /**
   * When the user presses the START button, start a new simulation with the selected room
   * @returns
   */
  protected startTelemetry(): void {
    // Check if a room is selected
    if (!this.selectedRoom?.id) {
      return;
    }
    // Start the simulation
    this.simulationState = 'start';
    this.telemetryService.simulationControl(this.selectedRoom.id, this.simulationState).then((res) => {
      if (!res.ok) {
        // Error
        console.log(`An error ocurred starting the sim!`);
      } else {
        // If the sim start returns ok, let's get the data on interval
        this.fetchAndEmitDataOnInterval();
      }
    });
  }

  /**
   * Gets the telemetry simulation data from the backend by room ID
   */
  private getSimulationData(): void {
    if (!this.selectedRoom?.id) {
      return;
    }
    this.telemetryService
      .getTelemetryByRoomID(this.selectedRoom.id)
      .then((res) => {
        this.telemetryData = res;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  /**
   * When the user presses the STOP button, stop the simulation and reset the switches to default
   * @returns
   */
  protected stopTelemetry(): void {
    if (!this.selectedRoom?.id) {
      return;
    }
    this.simulationState = 'stop';
    this.telemetryService.simulationControl(this.selectedRoom.id, this.simulationState).then((res) => {
      clearInterval(this.simInterval);
      this.resetSwitchesToDefault();
      this.connected = false;
      this.telemetryData = {} as TelemetryData; // Clear the sim data
      this.telemetryDataEmitter.emit(this.telemetryData);
    });
  }

  protected shouldAnimationStart(): boolean {
    // Only return true every five seconds
    const date = new Date();
    const seconds = date.getSeconds();
    if (seconds % 5 == 0) {
      return false;
    }
    return true;
  }

  /**
   * Handler for when an error switch is flipped
   * @param event
   */
  protected handleChange(event: any): void {
    this.switches[event.id].value = event.value;
    this.updateSwitchErrorsData();
  }

  /**
   * Updates the simulation errors data in the backend
   */
  private updateSwitchErrorsData(): void {
    this.switches.forEach((s: SimulationError) => {
      (this.simulationErrorData as any)[s.key] = s.value;
    });
    this.telemetryService
      .updateSimulationErrorsByID(this.simulationErrorData.id, this.simulationErrorData)
      .then((res) => {});
  }

  /**
   * Resets the switches to their default values
   */
  private resetSwitchesToDefault(): void {
    this.switches.forEach((s: SimulationError) => {
      s.value = false;
    });
    this.updateSwitchErrorsData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If the selected room changes, get the new room's telemetry data
    const newRoom: Room = changes['selectedRoom']?.currentValue;
    if (newRoom) {
      this.ngOnInit();
    }
  }
}
