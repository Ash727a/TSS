import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-shared-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {
  constructor() {}

  public testForm: NgForm | undefined;
  public isDropDownOpen: boolean = false;
  public dropdown: string = '';
  protected startingActiveIndex: number = 0;
  protected activeIndex: number = 0;

  @Input('buttonLabel') buttonLabel: string = 'Select';
  @Input('options') options: { isActive?: boolean; value: string }[] = [];
  @Input('hasNoneSelection') hasNoneSelection: boolean = true;
  @Output() private close: EventEmitter<object> = new EventEmitter<object>();

  ngOnInit() {
    let shiftIndex = 0;
    if (this.hasNoneSelection) {
      shiftIndex = 1;
    }
    for (let i = 0; i < this.options.length; i++) {
      if (this.options[i].isActive) {
        this.activeIndex = i + shiftIndex;
        this.startingActiveIndex = i + shiftIndex;
        break;
      }
    }
    if (this.hasNoneSelection) {
      // Add an option to the beginning of the array
      this.options.unshift({ value: 'None', isActive: this.activeIndex === 0 });
    }
  }

  toggleDropdown() {
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  selectOption(evt: any, optionIndex: number) {
    this.options.forEach((opt: any, index: number) => {
      this.activeIndex = optionIndex;
    });
    this.dropdown = evt.target.innerHTML;
  }

  onSubmit() {
    this.options.forEach((opt: any, index: number) => {
      opt.isActive = this.activeIndex === index;
    });
    const payload = {
      type: 'close',
      index: this.activeIndex,
    };
    this.close.emit(payload);
  }

  ngOnDestroy() {
    this.options.shift();
  }
}
