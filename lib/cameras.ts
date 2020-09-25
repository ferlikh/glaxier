import * as THREE from 'three';

export interface PerspectiveCameraOptions {
    fov: number;
    aspect: number;
    near: number;
    far: number;
}

export class Cameras {
    static perspective(options: PerspectiveCameraOptions) {
        return new THREE.PerspectiveCamera(
            options.fov,
            options.aspect,
            options.near,
            options.far
        );
    }
}