import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {
  private selectedCountriesSource = new BehaviorSubject<string[]>([]);
  selectedCountries$ = this.selectedCountriesSource.asObservable();

  updateSelection(countries: string[]) {
    this.selectedCountriesSource.next(countries);
  }

  clearSelection() {
    this.selectedCountriesSource.next([]);
  }
}
