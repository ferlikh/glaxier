export interface Settable {
    set(value: any);
}

export interface Valuable {
    value: any;
}

export interface Vector3Options {
    x?: number;
    y?: number;
    z?: number;
}

export interface Object3DOptions {
    position?: Vector3Options;
    rotation?: Vector3Options;
}
