// src/app/models/layer.model.ts

export interface Layer {
    id: string;
    name: string;
    type: 'point' | 'line' | 'polygon';
    visible: boolean;
    active: boolean;
}