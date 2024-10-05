export interface DataLoader {
    loadData(url: string): Promise<any>;
}

export interface CountryProperties {
    SOVEREIGNT: string;
    POP_EST: number;
    ISO_A3: string;
    ISO_A2: string;
}

export interface FlightProperties {
    airlineIata: string;
    lat1: string;
    lon1: string;
    lat2: string;
    lon2: string;
    base: string;
    ref: string;
}

export interface GeoJsonFeature<T> {
    type: "Feature";
    geometry: {
        type: string;
        coordinates: number[] | number[][] | number[][][];
    };
    properties: T;
}

export interface GeoJson<T> {
    type: "FeatureCollection";
    features: GeoJsonFeature<T>[];
}