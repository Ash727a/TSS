// ADAPTED FROM https://github.com/hssanbzlm/angular_reusable_modal_pattern/tree/master/src/app/modal
import { ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private componentRef!: ComponentRef<ModalComponent>;
  private componentSubscriber!: Subject<string>;
  constructor(private resolver: ComponentFactoryResolver) {}

  openModal(entry: ViewContainerRef, modalContentRef: TemplateRef<any>) {
    let factory = this.resolver.resolveComponentFactory(ModalComponent);
    this.componentRef = entry.createComponent(factory);
    this.componentRef.instance.modalContentRef = modalContentRef;
    this.componentRef.instance.closeMeEvent.subscribe(() => this.closeModal());
    this.componentRef.instance.confirmEvent.subscribe(() => this.confirm());
    this.componentSubscriber = new Subject<string>();
    return this.componentSubscriber.asObservable();
  }


  closeModal() {
    this.componentSubscriber.complete();
    this.componentRef.destroy();
  }

  confirm() {
    this.componentSubscriber.next('confirm');
    this.closeModal();
  }
}
