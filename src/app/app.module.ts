import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FrameComponent } from './frame/frame.component';
import { LayerSelectorComponent } from './layer-selector/layer-selector.component';
import { MapComponent } from './map/map.component';
import { TableComponent } from './table/table.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FrameComponent,
    MapComponent,
    TableComponent,
    LayerSelectorComponent
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
