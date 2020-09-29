import * as THREE from 'three';
import { Utils, Object3DOptions } from './utils';

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
    static perspective(options: PerspectiveCameraOptions, config?: Object3DOptions) {
        options.aspect = options.aspect ?? (window.innerWidth / window.innerHeight);
        const camera = new THREE.PerspectiveCamera(
            options.fov,
            options.aspect,
            options.near,
            options.far
        );
        return Utils.configure(camera, config);
    }

    static orthographic(options: OrthographicCameraOptions, config?: Object3DOptions) {
        const camera = new THREE.OrthographicCamera(
            options.left,
            options.right,
            options.top,
            options.bottom,
            options.near,
            options.far
        );
        return Utils.configure(camera, config);
    }
}