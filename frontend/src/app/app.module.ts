import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UIAComponent } from './modules/uia/uia.component';
import { RoomsComponent } from './modules/rooms/rooms.component';
import { TelemetryComponent } from './modules/telemetry/telemetry.component';
import { LogsComponent } from './modules/logs/logs.component';
import { CardComponent } from './shared/components/card/card.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UIAComponent,
    RoomsComponent,
    TelemetryComponent,
    LogsComponent,
    CardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
