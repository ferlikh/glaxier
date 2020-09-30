import * as THREE from 'three';
import { Utils, Object3DOptions } from './utils';

export interface PerspectiveCameraOptions extends Object3DOptions {
    fov: number;
    aspect?: number;
    near: number;
    far: number;
}

export interface OrthographicCameraOptions extends Object3DOptions {
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
        const camera = new THREE.PerspectiveCamera(
            options.fov,
            options.aspect,
            options.near,
            options.far
        );
        return Utils.configure(camera, options);
    }

    static orthographic(options: OrthographicCameraOptions) {
        const camera = new THREE.OrthographicCamera(
            options.left,
            options.right,
            options.top,
            options.bottom,
            options.near,
            options.far
        );
        return Utils.configure(camera, options);
    }
}