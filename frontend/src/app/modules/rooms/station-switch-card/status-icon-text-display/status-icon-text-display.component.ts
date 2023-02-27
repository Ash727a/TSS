import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rooms-station-switch-card-status-icon-text-display',
  templateUrl: './status-icon-text-display.component.html',
  styleUrls: ['./status-icon-text-display.component.scss'],
})
export class StatusIconTextDisplayComponent {
  @Input() status: string = '';
  protected statusText: string = '';

  ngOnChanges(): void {
    // capitalize the first character
    if (this.status.length > 0) {
      this.statusText = this.status.charAt(0).toUpperCase() + this.status.slice(1);
    }
  }
}
