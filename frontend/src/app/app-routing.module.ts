import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LogsComponent } from './modules/logs/logs.component';
import { RoomsComponent } from './modules/rooms/rooms.component';
import { TelemetryComponent } from './modules/telemetry/telemetry.component';
import { RoverComponent } from './modules/rover/rover.component';
import { UIAComponent } from './modules/uia/uia.component';

const routes: Routes = [
  {
    path: 'rooms',
    component: RoomsComponent,
  },
  {
    path: 'uia',
    component: UIAComponent,
  },
  {
    path: 'telemetry',
    component: TelemetryComponent,
  },
  {
    path: 'rover',
    component: RoverComponent,
  },
  {
    path: 'logs',
    component: LogsComponent,
  },
  {
    path: '',
    redirectTo: 'rooms',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
