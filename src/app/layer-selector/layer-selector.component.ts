// src/app/components/layer-selector/layer-selector.component.ts

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Layer } from '../models/layer.model';
import { LayerService } from '../services/layer.service';

@Component({
  selector: 'app-layer-selector',
  templateUrl: './layer-selector.component.html',
  styleUrls: ['./layer-selector.component.scss']
})
export class LayerSelectorComponent implements OnInit {
  layers$: Observable<Layer[]>;

  constructor(private layerService: LayerService) {
    this.layers$ = this.layerService.getLayers();
  }

  ngOnInit(): void {}

  toggleVisibility(layerId: string): void {
    this.layerService.toggleLayerVisibility(layerId);
  }

  setActiveLayer(layerId: string): void {
    this.layerService.setActiveLayer(layerId);
  }
}