// ADAPTED FROM https://github.com/hssanbzlm/angular_reusable_modal_pattern/tree/master/src/app/modal
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, TemplateRef, Type  } from '@angular/core';

@Component({
  selector: 'app-shared-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit, OnDestroy {
  constructor() {}
  @Input() modalContentRef: TemplateRef<any> | null = null;
  @Output() closeMeEvent = new EventEmitter();
  @Output() confirmEvent = new EventEmitter();

  ngOnInit(): void {
    // console.log('Modal init');
  }

  closeMe() {
    this.closeMeEvent.emit();
  }
  confirm() {
    this.confirmEvent.emit();
  }

  ngOnDestroy(): void {
    // console.log('Modal destroyed');
  }
}
