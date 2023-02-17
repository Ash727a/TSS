import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shared-station-tag',
  templateUrl: './station-tag.component.html',
  styleUrls: ['./station-tag.component.scss'],
})
export class StationTagComponent {
  // @Input() station: "UIA" | "GEO" | "ROV" | undefined | null;
  @Input() public station: string | undefined | null;

}
