import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FlightProperties } from './models/geospatial-data.models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private worldDataUrl = './assets/110m/countries.geojson';
  private flightDataUrl = './assets/flights.json';

  constructor(private http: HttpClient) { }

  getWorldData(): Observable<any> {
    return this.http.get(this.worldDataUrl, { responseType: 'json' });
  }

  getFlightData(): Observable<FlightProperties[]> {
    return this.http.get<FlightProperties[]>(this.flightDataUrl);
  }
}