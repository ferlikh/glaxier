import * as THREE from 'three';

export interface PerspectiveCameraOptions {
    fov: number;
    aspect?: number;
    near: number;
    far: number;
}

export interface OrthographicCameraOptions {
    left: number;
    right: number;
    top: number;
    bottom: number;
    near?: number;
    far?: number;
}

export class Cameras {
    static perspective(options: PerspectiveCameraOptions) {
        options.aspect = options.aspect ?? (window.innerWidth / window.innerHeight);
        return new THREE.PerspectiveCamera(
            options.fov,
            options.aspect,
            options.near,
            options.far
        );
    }

    static orthographic(options: OrthographicCameraOptions) {
        return new THREE.OrthographicCamera(
            options.left,
            options.right,
            options.top,
            options.bottom,
            options.near,
            options.far
        );
    }
}