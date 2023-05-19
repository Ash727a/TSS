import { Component } from '@angular/core';
import config from '@app/config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  protected menu_icon_variable: boolean = false;
  protected menuVariable: boolean = false;
  protected routes: { name: string; path: string }[] = []
  private readonly prefix = config.USE_HASH_ROUTING ? '/#' : '';
  constructor() {
    this.routes = [
      { name: 'Rooms', path: `${this.prefix}/rooms` },
      { name: 'UIA', path: `${this.prefix}/uia` },
      { name: 'Rover', path: `${this.prefix}/rover` },
      { name: 'Telemetry', path: `${this.prefix}/telemetry` },
      { name: 'Logs', path: `${this.prefix}/logs` },
    ];
  }

  ngOnInit(): void { }
  openMenu() {
    this.menuVariable = !this.menuVariable;
    this.menu_icon_variable = !this.menu_icon_variable;
  }
}
