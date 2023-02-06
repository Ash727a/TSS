import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shared-control-button',
  templateUrl: './control-button.component.html',
  styleUrls: ['./control-button.component.scss']
})
export class ControlButtonComponent {
  @Input() disabled: boolean = false;
  @Input() type: string = 'default';
}
