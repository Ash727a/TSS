import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-shared-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss'],
})
export class ToggleSwitchComponent {
  @Input() public id: number = 0;
  @Input() public type: string = 'default';
  @Input() public disabled: boolean = false;
  @Input() public isErroring: boolean = false;
  @Output() private checked: EventEmitter<object> = new EventEmitter<object>();
  protected parentSelector: boolean = false;

  onChange(event: any, id: number) {
    const payload = {
      id: id,
      value: event.target.checked,
    };
    this.checked.emit(payload);
  }
  constructor() {}
}
