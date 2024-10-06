// src/app/services/layer.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Layer } from '../models/layer.model';
@Injectable({
    providedIn: 'root'
})
export class LayerService {
    private layers: Layer[] = [
        { id: 'countries', name: 'Countries', type: 'polygon', visible: true, active: true },
        { id: 'flights', name: 'Flight Routes', type: 'line', visible: true, active: false }
    ];
    private layersSubject = new BehaviorSubject<Layer[]>(this.layers);
    getLayers(): Observable<Layer[]> {
        return this.layersSubject.asObservable();
    }
    toggleLayerVisibility(layerId: string): void {
        const layer = this.layers.find(l => l.id === layerId);
        if (layer) {
            layer.visible = !layer.visible;
            this.layersSubject.next(this.layers);
        }
    }
    setActiveLayer(layerId: string): void {
        this.layers.forEach(layer => {
            layer.active = layer.id === layerId;
        });
        this.layersSubject.next(this.layers);
    }
}