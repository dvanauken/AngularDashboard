// src/app/selection.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class SelectionService {
    private selectedCountriesSource = new BehaviorSubject<string[]>([]);
    selectedCountries$: Observable<string[]> = this.selectedCountriesSource.asObservable();
    private selectedRoutesSource = new BehaviorSubject<string[]>([]);
    selectedRoutes$: Observable<string[]> = this.selectedRoutesSource.asObservable();
    updateSelection(countries: string[]) {
        this.selectedCountriesSource.next(countries);
    }
    updateRouteSelection(routes: string[]) {
        this.selectedRoutesSource.next(routes);
    }
    clearSelection() {
        this.selectedCountriesSource.next([]);
        this.selectedRoutesSource.next([]);
    }
}