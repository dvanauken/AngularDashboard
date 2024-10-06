import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener, OnDestroy } from '@angular/core';
import * as d3 from 'd3';
import * as d3Geo from 'd3-geo';
import { Subscription } from 'rxjs';
import { FlightProperties } from '../models/geospatial-data.models';
import { Layer } from '../models/layer.model';
import { LayerService } from "../services/layer.service";
import { SelectionService } from '../selection.service';
import { DataService } from '../data.service';

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
    private flights: FlightProperties[] = [];
    private selectedCountries: string[] = [];
    private selectedRoutes: string[] = [];
    private subscription: Subscription;
    private activeLayer: Layer | null = null;
    private layers: Layer[] = [];

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
                this.updateMapSelection();
            })
        );
        this.subscription.add(
            this.selectionService.selectedRoutes$.subscribe((routes: string[]) => {
                this.selectedRoutes = routes;
                this.updateMapSelection();
            })
        );
        this.subscription.add(
            this.layerService.getLayers().subscribe(layers => {
                this.layers = layers;
                this.activeLayer = layers.find(layer => layer.active) || null;
                this.updateMapLayers();
            })
        );
    }

    ngAfterViewInit() {
        this.createMap();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private loadData(): void {
        this.dataService.getWorldData().subscribe(
            (worldData: any) => {
                this.geojson = worldData;
                this.drawMap();
            },
            error => {
                console.error('Error loading world data:', error);
            }
        );

        this.dataService.getFlightData().subscribe(
            (flightData: FlightProperties[]) => {
                this.flights = flightData;
                this.drawFlightPaths();
            },
            error => console.error('Error loading flight data:', error)
        );
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
    }

    private drawMap(): void {
        if (this.svg && this.geojson) {
            this.svg.selectAll('path')
                .data(this.geojson.features)
                .enter()
                .append('path')
                .attr('d', this.path)
                .attr('class', 'country')
                .on('click', (event: MouseEvent, d: any) => this.onCountryClick(event, d));

            this.updateMapSelection();
            this.updateMapLayers();
        }
    }

    private drawFlightPaths(): void {
        console.log('Drawing flight paths:', this.flights);
        if (this.svg && this.flights.length > 0) {
            const geoPath = d3Geo.geoPath().projection(this.projection);

            this.svg.selectAll('.flight-path')
                .data(this.flights)
                .enter()
                .append('path')
                .attr('class', 'flight-path')
                .attr('d', (d: FlightProperties) => {
                    const source: [number, number] = [parseFloat(d.lon1), parseFloat(d.lat1)];
                    const target: [number, number] = [parseFloat(d.lon2), parseFloat(d.lat2)];
                    const greatCircle = d3Geo.geoInterpolate(source, target);
                    const numPoints = 100;
                    const points = Array.from({length: numPoints}, (_, i) => greatCircle(i / (numPoints - 1)));
                    return geoPath({type: "LineString", coordinates: points});
                })
                .style('fill', 'none')
                .style('stroke', 'red')
                .style('stroke-width', '2px')
                .style('cursor', 'pointer')
                .on('mouseover', function(this: SVGPathElement, event: any, d: FlightProperties) {
                    d3.select(this).style('stroke-width', '4px');
                })
                .on('mouseout', function(this: SVGPathElement, event: any, d: FlightProperties) {
                    const routeId = `${d.airlineIata}-${d.lat1}-${d.lon1}-${d.lat2}-${d.lon2}`;
                    //const width = this.selectedRoutes.includes(routeId) ? '4px' : '2px';
                    const width = (this as any).selectedRoutes.includes(routeId) ? '4px' : '2px';
                    d3.select(this).style('stroke-width', width);
                })
                .on('click', (event: MouseEvent, d: FlightProperties) => this.onRouteClick(event, d));

            this.updateMapSelection();
            this.updateMapLayers();
        }
    }

    private onCountryClick(event: MouseEvent, d: any): void {
        const countryId = d.properties.ISO_A3;
        if (event.shiftKey) {
            this.addToSelection(countryId);
        } else if (event.ctrlKey || event.metaKey) {
            this.toggleSelection(countryId);
        } else {
            this.newSelection(countryId);
        }
    }

    private onRouteClick(event: MouseEvent, d: FlightProperties): void {
        event.stopPropagation(); // Prevent map click event
        const routeId = `${d.airlineIata}-${d.lat1}-${d.lon1}-${d.lat2}-${d.lon2}`;
        if (event.shiftKey) {
            this.addToRouteSelection(routeId);
        } else if (event.ctrlKey || event.metaKey) {
            this.toggleRouteSelection(routeId);
        } else {
            this.newRouteSelection(routeId);
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

    private updateMapSelection(): void {
        if (this.svg) {
            // Update country selection
            this.svg.selectAll('.country')
                .classed('selected', (d: any) => this.selectedCountries.includes(d.properties.ISO_A3));

            // Update flight path selection
            this.svg.selectAll('.flight-path')
                .classed('selected', (d: FlightProperties) => {
                    const routeId = `${d.airlineIata}-${d.lat1}-${d.lon1}-${d.lat2}-${d.lon2}`;
                    return this.selectedRoutes.includes(routeId);
                })
                .style('stroke', (d: FlightProperties) => {
                    const routeId = `${d.airlineIata}-${d.lat1}-${d.lon1}-${d.lat2}-${d.lon2}`;
                    return this.selectedRoutes.includes(routeId) ? 'yellow' : 'red';
                })
                .style('stroke-width', (d: FlightProperties) => {
                    const routeId = `${d.airlineIata}-${d.lat1}-${d.lon1}-${d.lat2}-${d.lon2}`;
                    return this.selectedRoutes.includes(routeId) ? 4 : 2;
                });
        }
    }

    private updateMapLayers() {
        if (this.svg) {
            this.svg.selectAll('.country')
                .style('display', this.isLayerVisible('countries') ? null : 'none');
            this.svg.selectAll('.flight-path')
                .style('display', this.isLayerVisible('flights') ? null : 'none');
        }
    }

    private isLayerVisible(layerId: string): boolean {
        const layer = this.layers.find(l => l.id === layerId);
        return layer ? layer.visible : false;
    }

    @HostListener('document:keydown.escape', ['$event'])
    handleEscapeKey(event: KeyboardEvent) {
        this.selectionService.clearSelection();
    }

    clearSelection() {
        this.selectionService.clearSelection();
    }
}