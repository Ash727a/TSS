import { Component } from '@angular/core';
import { Switch } from '@core/interfaces';
// Backend
import { TelemetryService } from '@services/api/telemetry.service';

@Component({
  selector: 'app-telemetry-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss'],
  providers: [TelemetryService],
})
export class ControllerComponent {
  private static readonly DEFAULT_DISPLAY: string = '00:00';
  connected: boolean = false;
  switches: Switch[];
  display: string = ControllerComponent.DEFAULT_DISPLAY;
  timer!: ReturnType<typeof setTimeout>;

  // TEMPORARY
  selectedRoom: number = 1;
  simInterval!: ReturnType<typeof setTimeout>;
  connErr: string = '';
  telemetryData: {} = {};
  evaSimState: string = '';

  constructor(private telemetryService: TelemetryService) {
    this.switches = [
      { name: 'O2 ERROR', value: false },
      { name: 'PUMP ERROR', value: false },
      { name: 'FAN ERROR', value: false },
      { name: 'POWER ERROR', value: false },
    ];
  }

  initTimer() {
    let totalSeconds: number = 0;
    let secondsDisplay: any = '0';
    let secondsNumber: number = 0;

    this.timer = setInterval(() => {
      totalSeconds++;
      if (secondsNumber < 59) {
        secondsNumber++;
      } else {
        secondsNumber = 0;
      }

      if (secondsNumber < 10) {
        secondsDisplay = '0' + secondsNumber;
      } else secondsDisplay = secondsNumber;

      let minute = Math.floor(totalSeconds / 60);
      let prefix = minute < 10 ? '0' : '';
      this.display = `${prefix}${minute}:${secondsDisplay}`;
    }, 1000);
  }

  // When the user presses the START button
  startTelemetry() {
    // Start the simulation
    this.evaSimState = 'start';
    this.telemetryService.simulationControl(this.selectedRoom, this.evaSimState).then((res) => {
      if (!res.ok) { // Error
        console.log(`An error ocurred starting the sim!`);
      } else {
        // If the sim start returns ok, let's get the data on interval
        this.simInterval = setInterval(() => {
          this.getSimulationData();
        }, 1000);
        // Set connected status to true, start the connection heartbeat timer
        this.connected = true;
        this.initTimer();
      }
    });
  }

  // Get EVA Sim Data
  private getSimulationData() {
    if (this.connErr === '') {
      this.telemetryService
        .getTelemetry(this.selectedRoom)
        .then((res) => {
          this.telemetryData = res;
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  // When the user presses the STOP button
  stopTelemetry() {
    this.evaSimState = 'stop';
    this.telemetryService.simulationControl(this.selectedRoom, this.evaSimState).then(res => {
      clearInterval(this.simInterval);
      clearInterval(this.timer);
      this.display = ControllerComponent.DEFAULT_DISPLAY;
      this.connected = false;
      this.telemetryData = {}; // Clear the sim data
    });
  }

  shouldAnimationStart() {
    // only return true every five seconds
    const date = new Date();
    const seconds = date.getSeconds();
    if (seconds % 5 == 0) {
      return false;
    }
    return true;
  }
  handleChange(event: any) {
    this.switches[event.id].value = event.value;
  }
}
