import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, TemplateRef } from '@angular/core';
import { ModalService } from '@services/modal/modal.service';
import { Subscription } from 'rxjs';
// Backend
import { APIService } from '@services/api/api.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
  providers: [ModalService, APIService],
})
export class RoomsComponent implements OnInit, OnDestroy {
//   createdAt
// : 
// "2023-02-14T16:21:48.100Z"
// id
// : 
// 1
// name
// : 
// "alpha"
// updatedAt
// : 
// "2023-02-14T16:21:48.100Z"
// users
// : 
// 0
  rooms: { id: number; name: string; status: string; station: string, updatedAt: Date, createdAt: Date, users: number | undefined | null }[] = [];
  modalOpen: boolean = false;
  selectedRoom: { id: number; name: string; status: string; station: string, updatedAt: Date, createdAt: Date, users: number | undefined | null } | null = null;

  @ViewChild('modal', { read: ViewContainerRef })
  entry!: ViewContainerRef;
  sub!: Subscription;

  @ViewChild('modal') modalContentRef!: TemplateRef<any>;

  constructor(private modalService: ModalService, private apiService: APIService) {
    // this.rooms = [
    //   { id: 1, teamName: 'Team 1', status: 'green', station: 'UIA' },
    //   { id: 2, teamName: 'Team 2', status: 'green', station: 'GEO' },
    //   { id: 3, teamName: 'Team 3', status: 'green', station: 'ROV' },
    //   { id: 4, teamName: 'Team 4', status: 'green', station: '' },
    //   { id: 5, teamName: 'Team 5', status: 'green', station: '' },
    //   { id: 6, teamName: 'Team 6', status: 'green', station: '' },
    //   { id: 7, teamName: 'Team 7', status: 'green', station: '' },
    //   { id: 8, teamName: 'Team 8', status: 'green', station: '' },
    //   { id: 9, teamName: 'Team 9', status: 'green', station: '' },
    //   { id: 10, teamName: 'Team 10', status: 'green', station: '' },
    // ];
  }

  ngOnInit(): void {
    this.apiService
      .getRooms()
      .then((result) => {
        this.rooms = result;
        console.log(this.rooms);
      })
      .catch((e) => {
        console.warn(e);
      });
  }

  openModal(room: { id: number; name: string; status: string; station: string, updatedAt: Date, createdAt: Date, users: number | undefined | null }) {
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
  switch() {
    console.log('switch clicked');
  }
}
