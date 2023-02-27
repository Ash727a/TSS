import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shared-control-button',
  templateUrl: './control-button.component.html',
  styleUrls: ['./control-button.component.scss']
})
export class ControlButtonComponent {
  @Input() public variant: 'default' | 'light' = 'default';
  @Input() public disabled: boolean = true;
  @Input() public type: string = 'default';
}
