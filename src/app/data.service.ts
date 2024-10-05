import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private worldDataUrl = 'https://d3js.org/world-50m.v1.json'; // URL to your world data JSON file

  constructor(private http: HttpClient) { }

  getWorldData(): Observable<any> {
    return this.http.get(this.worldDataUrl);
  }
}
