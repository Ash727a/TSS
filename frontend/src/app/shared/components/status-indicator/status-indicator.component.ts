import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-shared-status-indicator',
  templateUrl: './status-indicator.component.html',
  styleUrls: ['./status-indicator.component.scss'],
})
export class StatusIndicatorComponent implements OnInit {
  @Input() status: any;
  color: string | undefined;

  constructor() {}

  ngOnInit() {
    if (this.status === undefined) {
      this.status = 'gray';
    }
  }

  getColorClass() {
    return this.status === 'green'
      ? 'green'
      : this.status === 'yellow'
      ? 'yellow'
      : this.status === 'red'
      ? 'red'
      : 'gray';
  }
}
