import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SelectionService } from '../selection.service';
import { DataService } from '../data.service';
import { LayerService } from '../services/layer.service';
import { Layer } from '../models/layer.model';
import {FlightProperties} from "../models/geospatial-data.models";

interface CountryData {
  SOVEREIGNT: string;
  POP_EST: number;
  ISO_A3: string;
  ISO_A2: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {
  countries: CountryData[] = [];
  flights: FlightProperties[] = []; // Add this line
  selectedCountries: string[] = [];
  selectedRoutes: string[] = [];
  activeLayer: Layer | null = null;
  private subscription: Subscription;

  constructor(
      private selectionService: SelectionService,
      private dataService: DataService,
      private layerService: LayerService
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

    this.subscription.add(
        this.selectionService.selectedRoutes$.subscribe((routes: string[]) => {
          this.selectedRoutes = routes;
        })
    );

    this.subscription.add(
        this.layerService.getLayers().subscribe(layers => {
          this.activeLayer = layers.find(layer => layer.active) || null;
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
    this.dataService.getFlightData().subscribe(
        (flightData: FlightProperties[]) => {
          this.flights = flightData;
        },
        error => console.error('Error loading flight data:', error)
    );
  }

  private processWorldData(worldData: any) {
    if (!worldData.features || !Array.isArray(worldData.features)) {
      console.error('Invalid GeoJSON structure');
      return;
    }
    this.countries = worldData.features.map((feature: any) => ({
      SOVEREIGNT: feature.properties.SOVEREIGNT,
      POP_EST: feature.properties.POP_EST,
      ISO_A3: feature.properties.ISO_A3,
      ISO_A2: feature.properties.ISO_A2
    }));
  }

  isSelected(countryId: string): boolean {
    return this.selectedCountries.includes(countryId);
  }

  onRowClick(event: MouseEvent, countryId: string) {
    event.preventDefault(); // Prevent default selection behavior
    if (event.shiftKey) {
      this.addToSelection(countryId);
    } else if (event.ctrlKey || event.metaKey) {
      this.toggleSelection(countryId);
    } else {
      this.newSelection(countryId);
    }
  }

  onRouteRowClick(event: MouseEvent, route: FlightProperties) {
    event.preventDefault();
    const routeId = `${route.airlineIata}-${route.lat1}-${route.lon1}-${route.lat2}-${route.lon2}`;
    if (event.shiftKey) {
      this.addToRouteSelection(routeId);
    } else if (event.ctrlKey || event.metaKey) {
      this.toggleRouteSelection(routeId);
    } else {
      this.newRouteSelection(routeId);
    }
  }

  private addToRouteSelection(routeId: string) {
    if (!this.selectedRoutes.includes(routeId)) {
      const updatedSelection = [...this.selectedRoutes, routeId];
      this.selectionService.updateRouteSelection(updatedSelection);
    }
  }

  private toggleRouteSelection(routeId: string) {
    const updatedSelection = this.selectedRoutes.includes(routeId)
        ? this.selectedRoutes.filter(id => id !== routeId)
        : [...this.selectedRoutes, routeId];
    this.selectionService.updateRouteSelection(updatedSelection);
  }

  private newRouteSelection(routeId: string) {
    this.selectionService.updateRouteSelection([routeId]);
  }

  isRouteSelected(route: FlightProperties): boolean {
    const routeId = `${route.airlineIata}-${route.lat1}-${route.lon1}-${route.lat2}-${route.lon2}`;
    return this.selectedRoutes.includes(routeId);
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

  sortByName() {
    this.countries.sort((a, b) => a.SOVEREIGNT.localeCompare(b.SOVEREIGNT));
  }

  sortByPopulation() {
    this.countries.sort((a, b) => b.POP_EST - a.POP_EST);
  }

  // You can add filtering methods here if needed
  filterByContinent(continent: string) {
    // Implementation remains the same
  }
}