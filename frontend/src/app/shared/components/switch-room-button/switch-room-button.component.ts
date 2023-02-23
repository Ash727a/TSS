import {
  Component,
  Input,
  Output,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  TemplateRef,
  EventEmitter,
} from '@angular/core';
import { ModalService } from '@services/modal/modal.service';
import { Subscription } from 'rxjs';
import { Room } from '@app/core/interfaces';
// Backend
import { RoomsService } from '@services/api/rooms.service';

/** | EXAMPLE USAGE |
  <app-shared-switch-room-button
    (click)="$event.stopPropagation()" // (Optional) If the component is nested inside a clickable, prevent the parent's click event
    [selectedRoom]="selectedRoom"      // (Optional) Will set the currently selected room
    [rooms]="rooms"                    // *REQUIRED* Array of rooms    
    [room]="room"                      // *REQUIRED* Room type which is the current room
    (changeEvent)="dropdownVisibilityChanged($event)" // (Optional) Event emitted when the dropdown is opened or closed
    [disabledDropdown]="modalOpen"     // (Optional) If the dropdown should be disabled
    />
 */

@Component({
  selector: 'app-shared-switch-room-button',
  templateUrl: './switch-room-button.component.html',
  styleUrls: ['./switch-room-button.component.scss'],
})
export class SwitchRoomButtonComponent implements OnInit, OnDestroy {
  @Input() public rooms: Room[] = [];
  @Input() public room: Room | null = null;
  @Input() public disabledDropdown: boolean = false;
  @Output() private changeEvent: EventEmitter<object> = new EventEmitter<object>();

  protected selectedRoom: Room | null = null;
  protected dropdownOpen = false;
  public roomChoices: { value: string; isActive: boolean | undefined }[] = [];

  @ViewChild('dropdown', { read: ViewContainerRef }) private dropdownEntry!: ViewContainerRef;
  private dropdownSub!: Subscription;

  @ViewChild('dropdown') private dropdownContentRef!: TemplateRef<any>;

  constructor(private modalService: ModalService, private roomsService: RoomsService) {}

  ngOnInit(): void {
    // Get all rooms
    this.roomsService
      .getRooms()
      .then((result) => {
        this.rooms = result;
      })
      .catch((e) => {
        console.warn(e);
      })
      .finally(() => {
        // this.loaded = true;
      });
  }

  protected openDropdown(room: Room | null) {
    if (!room || this.disabledDropdown || !this.rooms) return;
    this.selectedRoom = room;
    this.roomChoices = [];
    for (let i = 0; i < this.rooms.length; i++) {
      const each = this.rooms[i];
      this.roomChoices.push({
        value: `${each.id} - ${each.name}`,
        isActive: each.id === this.selectedRoom.id,
      });
    }
    const payload = {
      type: 'open',
    };
    this.changeEvent.emit(payload);
    // Wait a little bit for a HTML to update so the correct data is displayed in the modal
    setTimeout(() => {
      this.dropdownOpen = true;
      this.dropdownSub = this.modalService
        .openModal(this.dropdownEntry, this.dropdownContentRef, false)
        .subscribe((v) => {
          // When the dropdown is closed, and new room wasn't assigned
          if (v === 'close') {
            this.selectedRoom = null;
            this.dropdownOpen = false;
            const payload = {
              type: 'close',
              room: null,
            };
            this.changeEvent.emit(payload);
          }
        });
    }, 100);
  }

  protected closeDropdown(event: any) {
    const { type, index } = event;
    if (this.rooms && type === 'close') {
      this.selectedRoom = this.rooms[index];
    }
    const payload = {
      type: 'close',
      room: this.selectedRoom,
    };
    this.changeEvent.emit(payload);
    this.selectedRoom = null;
    this.dropdownOpen = false;
    this.modalService.closeModal();
  }

  ngOnDestroy(): void {
    if (this.dropdownSub) {
      this.dropdownSub?.unsubscribe();
      this.selectedRoom = null;
      this.dropdownOpen = false;
    }
  }
}
