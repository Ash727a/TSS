import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-shared-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss'],
})
export class ToggleSwitchComponent {
  parentSelector: boolean = false;
  @Input() id: number = 0;
  @Input() type: string = 'default';
  @Input() disabled: boolean = false;
  @Input() isErroring: boolean = false;
  @Output() checked: EventEmitter<object> = new EventEmitter<object>();

  onChange(event: any, id: number) {
    const payload = {
      id: id,
      value: event.target.checked,
    };
    this.checked.emit(payload);
  }
  constructor() {
  }
}
