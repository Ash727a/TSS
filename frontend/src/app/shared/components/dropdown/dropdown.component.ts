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

  @Input('options') options: { isActive?: boolean; value: string }[] = [];
  @Output() private close: EventEmitter<object> = new EventEmitter<object>();

  ngOnInit() {
    console.log('init dropdown')
    for (let i = 0; i < this.options.length; i++) {
      if (this.options[i].isActive) {
        this.activeIndex = i + 1;
        this.startingActiveIndex = i + 1;
        break;
      }
    }
    // add an option to the beginning of the array
    this.options.unshift({ value: 'None', isActive: this.activeIndex === 0 });
    console.log(this.options);

    // this.options.splice(0, 0, { value: '', isActive: true });
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
      index: this.activeIndex
    }
    this.close.emit(payload);
  }

  ngOnDestroy() {
    this.options.shift();
  }
}
