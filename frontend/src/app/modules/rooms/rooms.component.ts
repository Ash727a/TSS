import { Component } from '@angular/core';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent {
  rooms: { number: number; teamName: string; status: string; station: string | undefined | null }[] = [];

  constructor() {
    this.rooms = [
      { number: 1, teamName: 'Team 1', status: 'green', station: 'UIA' },
      { number: 2, teamName: 'Team 2', status: 'green', station: 'GEO' },
      { number: 3, teamName: 'Team 3', status: 'green', station: 'ROV' },
      { number: 4, teamName: 'Team 4', status: 'green', station: 'UIA' },
    ];
  }

}
