import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SelectionService } from '../selection.service';
import { DataService } from '../data.service';

interface CountryData {
  id: string;
  type: string;
  arcs?: any[];
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {
  countries: CountryData[] = [];
  selectedCountries: string[] = [];
  private subscription: Subscription;

  constructor(
    private selectionService: SelectionService,
    private dataService: DataService
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit() {
    this.loadData();
    this.subscription.add(
      this.selectionService.selectedCountries$.subscribe(countries => {
        this.selectedCountries = countries;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadData() {
    this.dataService.getWorldData().subscribe(
      (worldData: any) => {
        this.processWorldData(worldData);
      },
      (error: any) => {
        console.error('Error loading country data:', error);
      }
    );
  }

  private processWorldData(worldData: any) {
    const countriesGeometry = worldData.objects.countries.geometries;
    this.countries = countriesGeometry.map((geo: any) => ({
      id: geo.id,
      type: geo.type,
      arcs: geo.arcs
    }));
  }

  public countArcs(arcs: any[] | undefined): number {
    if (!arcs) return 0;
    if (Array.isArray(arcs[0])) {
      return arcs.length;
    } else {
      return 1;
    }
  }

  public calculateComplexity(arcs: any[] | undefined): number {
    if (!arcs) return 0;
    if (Array.isArray(arcs[0])) {
      return arcs.flat(Infinity).length;
    } else {
      return arcs.length;
    }
  }

  isSelected(countryId: string): boolean {
    return this.selectedCountries.includes(countryId);
  }

  onCheckboxChange(event: Event, countryId: string) {
    const isChecked = (event.target as HTMLInputElement).checked;
    let updatedSelection = [...this.selectedCountries];

    if (isChecked && !updatedSelection.includes(countryId)) {
      updatedSelection.push(countryId);
    } else if (!isChecked) {
      updatedSelection = updatedSelection.filter(id => id !== countryId);
    }

    this.selectionService.updateSelection(updatedSelection);
  }

  onRowClick(event: MouseEvent, countryId: string) {
    if (event.shiftKey) {
      this.addToSelection(countryId);
    } else if (event.ctrlKey || event.metaKey) {
      this.toggleSelection(countryId);
    } else {
      this.newSelection(countryId);
    }
  }

  private addToSelection(countryId: string) {
    if (!this.selectedCountries.includes(countryId)) {
      const updatedSelection = [...this.selectedCountries, countryId];
      this.selectionService.updateSelection(updatedSelection);
    }
  }

  private toggleSelection(countryId: string) {
    const updatedSelection = this.selectedCountries.includes(countryId)
      ? this.selectedCountries.filter(id => id !== countryId)
      : [...this.selectedCountries, countryId];
    this.selectionService.updateSelection(updatedSelection);
  }

  private newSelection(countryId: string) {
    this.selectionService.updateSelection([countryId]);
  }

  clearSelection() {
    this.selectionService.clearSelection();
  }
}
