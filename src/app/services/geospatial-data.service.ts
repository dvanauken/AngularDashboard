import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    DataLoader,
    CountryProperties,
    FlightProperties,
    GeoJson
} from '../models/geospatial-data.models';

@Injectable({
    providedIn: 'root'
})
export class GeospatialDataService {
    private dataLoaders: Map<string, DataLoader> = new Map();

    constructor(private http: HttpClient) {
        this.dataLoaders.set('json', {
            loadData: (url: string) => this.http.get(url).toPromise()
        });
        this.dataLoaders.set('geojson', {
            loadData: (url: string) => this.http.get(url).toPromise()
        });
    }

    private loadData<T>(url: string, fileType: 'json' | 'geojson'): Observable<T> {
        const loader = this.dataLoaders.get(fileType);
        if (!loader) {
            throw new Error(`No loader found for file type: ${fileType}`);
        }
        return from(loader.loadData(url) as Promise<T>);
    }

    loadCountryData(): Observable<GeoJson<CountryProperties>> {
        return this.loadData<GeoJson<CountryProperties>>('assets/110m/countries.geojson', 'geojson');
    }

    loadFlightData(): Observable<FlightProperties[]> {
        return this.loadData<FlightProperties[]>('assets/flights.json', 'json');
    }

    // You can add more methods here for loading airline and airport data
}