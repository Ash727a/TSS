import { Component } from '@angular/core';

@Component({
  selector: 'app-telemetry-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss']
})
export class ControllerComponent {
  DEFAULT_DISPLAY: string = '00:00';
  connected: boolean = false;
  switches: { name: string; value: boolean }[];
  display: string = this.DEFAULT_DISPLAY;
  timer!: ReturnType<typeof setTimeout>;

  constructor() {
    this.switches = [
      { name: 'O2 ERROR', value: true },
      { name: 'PUMP ERROR', value: false },
      { name: 'FAN ERROR', value: false },
      { name: 'POWER ERROR', value: false },
    ];
  }

  initTimer() {
    let totalSeconds: number = 0;
    let secondsDisplay: any = "0";
    let secondsNumber: number = 0;

    this.timer = setInterval(() => {
      totalSeconds++;
      if (secondsNumber < 59) {
        secondsNumber++;
      } else {
        secondsNumber = 0;
      }

      if (secondsNumber < 10) {
        secondsDisplay = "0" + secondsNumber;
      } else secondsDisplay = secondsNumber;

      let minute = Math.floor(totalSeconds / 60);
      let prefix = minute < 10 ? "0" : "";
      this.display = `${prefix}${minute}:${secondsDisplay}`;
    }, 1000);
  }

  startTelemetry() {
    this.connected = true;
    this.initTimer();
  }
  stopTelemetry() {
    clearInterval(this.timer);
    this.display = this.DEFAULT_DISPLAY;
    this.connected = false;
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
