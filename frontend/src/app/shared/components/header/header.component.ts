import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  menu_icon_variable: boolean = false;
  menuVariable: boolean = false;
  routes: { name: string; path: string }[] = []

  constructor() {
    this.routes = [
      { name: 'Rooms', path: '/rooms' },
      { name: 'UIA', path: '/uia' },
      { name: 'Telemetry', path: '/telemetry' },
      { name: 'Logs', path: '/logs' },
    ];
  }

  ngOnInit(): void {}
  openMenu() {
    this.menuVariable = !this.menuVariable;
    this.menu_icon_variable = !this.menu_icon_variable;
  }
}
