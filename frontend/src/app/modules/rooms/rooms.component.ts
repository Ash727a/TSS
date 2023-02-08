import { Component, OnInit, OnDestroy, ViewChild, ViewChildren, QueryList, ContentChild, ViewContainerRef, ElementRef, TemplateRef } from '@angular/core';
import { ModalService } from '@services/modal/modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
  providers: [ModalService],
})
export class RoomsComponent implements OnInit, OnDestroy {
  rooms: { number: number; teamName: string; status: string; station: string | undefined | null }[] = [];
  modalOpen: boolean = false;
  selectedRoom: { number: number; teamName: string; status: string; station: string | undefined | null } | null = null

  @ViewChild('modal', { read: ViewContainerRef })
  entry!: ViewContainerRef;
  sub!: Subscription;

  @ViewChild('modal') modalContentRef!: TemplateRef<any>;

  constructor(private modalService: ModalService) {
    this.rooms = [
      { number: 1, teamName: 'Team 1', status: 'green', station: 'UIA' },
      { number: 2, teamName: 'Team 2', status: 'green', station: 'GEO' },
      { number: 3, teamName: 'Team 3', status: 'green', station: 'ROV' },
      { number: 4, teamName: 'Team 4', status: 'green', station: 'UIA' },
    ];
  }

  ngOnInit(): void {}
  openModal(room: { number: number; teamName: string; status: string; station: string | undefined | null}) {
    this.selectedRoom = room;
    // Wait a little bit for a HTML to update so the correct data is displayed in the modal
    setTimeout(() => {
      this.sub = this.modalService.openModal(this.entry, this.modalContentRef).subscribe((v) => {
        // Logic here
      });
      this.modalOpen = true;
   }, 100);
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
      this.modalOpen = false;
      this.selectedRoom = null;
    }
  }
  switch(){
    console.log('switch clicked');
  }
}
