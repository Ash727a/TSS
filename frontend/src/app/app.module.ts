import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UIAComponent } from './modules/uia/uia.component';
import { RoomsComponent } from './modules/rooms/rooms.component';
import { TelemetryComponent } from './modules/telemetry/telemetry.component';
import { LogsComponent } from './modules/logs/logs.component';
import { CardComponent } from './shared/components/card/card.component';
import { StatusIndicatorComponent } from './shared/components/status-indicator/status-indicator.component';
import { OutlinedButtonComponent } from './shared/components/outlined-button/outlined-button.component';
import { StationTagComponent } from './shared/components/station-tag/station-tag.component';
import { ControlButtonComponent } from './shared/components/control-button/control-button.component';
import { ToggleSwitchComponent } from './shared/components/toggle-switch/toggle-switch.component';
import { ControllerComponent } from './modules/telemetry/controller/controller.component';
import { StateComponent } from './modules/telemetry/state/state.component';
import { ModalComponent } from './shared/components/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    UIAComponent,
    RoomsComponent,
    TelemetryComponent,
    LogsComponent,
    CardComponent,
    StatusIndicatorComponent,
    OutlinedButtonComponent,
    StationTagComponent,
    ControlButtonComponent,
    ToggleSwitchComponent,
    ControllerComponent,
    StateComponent,
    ModalComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, NgbModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
