import { Component, OnInit, OnDestroy, ViewChild, ContentChild, ViewContainerRef, ElementRef } from '@angular/core';
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

  @ViewChild('modal', { read: ViewContainerRef })
  entry!: ViewContainerRef;
  sub!: Subscription;

  @ViewChild('modal') modalContent!: ElementRef;

  constructor(private modalService: ModalService) {
    this.rooms = [
      { number: 1, teamName: 'Team 1', status: 'green', station: 'UIA' },
      { number: 2, teamName: 'Team 2', status: 'green', station: 'GEO' },
      { number: 3, teamName: 'Team 3', status: 'green', station: 'ROV' },
      { number: 4, teamName: 'Team 4', status: 'green', station: 'UIA' },
    ];
  }

  ngOnInit(): void {}
  openModal() {
    this.sub = this.modalService.openModal(this.entry, this.modalContent.nativeElement.innerHTML).subscribe((v) => {
      // Logic here
    });
    this.modalOpen = true;
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
      this.modalOpen = false;
    }
  }
}
