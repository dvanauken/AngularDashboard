import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FrameComponent } from './frame/frame.component';
import { MapComponent } from './map/map.component';
import { TableComponent } from './table/table.component';
import { CommonModule } from '@angular/common';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FrameComponent,
    MapComponent,
    TableComponent,
  ],
  imports: [
    AuthModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
