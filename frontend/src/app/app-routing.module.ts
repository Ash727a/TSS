import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UIAComponent } from './modules/uia/uia.component';
import { TelemetryComponent } from './modules/telemetry/telemetry.component';
import { RoomsComponent } from './modules/rooms/rooms.component';
import { LogsComponent } from './modules/logs/logs.component';

const routes: Routes = [
  {
      path: 'rooms',
      component: RoomsComponent
  },
  {
      path: 'uia',
      component: UIAComponent
  },
  {
      path: 'telemetry',
      component: TelemetryComponent
  },
  {

      path: 'logs',
      component: LogsComponent
  },
  {
      path: '',
      redirectTo: '',
      pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
