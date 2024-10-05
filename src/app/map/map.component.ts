import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener, OnDestroy } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { SelectionService } from '../selection.service';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) private mapContainer!: ElementRef;
  private svg: any;
  private projection: any;
  private path: any;
  private geojson: any;
  private selectedCountries: string[] = [];
  private subscription: Subscription;

  constructor(
    private selectionService: SelectionService,
    private dataService: DataService
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit() {
    this.subscription.add(
      this.selectionService.selectedCountries$.subscribe(countries => {
        this.selectedCountries = countries;
        this.updateMapSelection();
      })
    );
  }

  ngAfterViewInit() {
    this.createMap();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private createMap(): void {
    const element = this.mapContainer.nativeElement;
    const width = element.offsetWidth;
    const height = element.offsetHeight;

    this.svg = d3.select(element).append('svg')
      .attr('width', width)
      .attr('height', height);

    this.projection = d3.geoMercator()
      .scale(100)
      .translate([width / 2, height / 2]);

    this.path = d3.geoPath().projection(this.projection);

    this.dataService.getWorldData().subscribe(
      (worldData: any) => {
        this.geojson = topojson.feature(worldData, worldData.objects.countries);
        this.drawMap();
      },
      error => console.error('Error loading world data:', error)
    );
  }

  private drawMap(): void {
    this.svg.selectAll('path')
      .data(this.geojson.features)
      .enter()
      .append('path')
      .attr('d', this.path)
      .attr('class', 'country')
      .on('click', (event: MouseEvent, d: any) => this.onCountryClick(event, d));

    this.updateMapSelection();
  }

  private onCountryClick(event: MouseEvent, d: any): void {
    const countryId = d.id;
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

  private updateMapSelection(): void {
    if (this.svg) {
      this.svg.selectAll('.country')
        .classed('selected', (d: any) => this.selectedCountries.includes(d.id));
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    this.selectionService.clearSelection();
  }

  clearSelection() {
    this.selectionService.clearSelection();
  }

}
