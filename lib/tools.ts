/**
 * A namespace for scene helpers.
 */
import * as THREE from 'three';

export class Tools {
    static renderer(renderer = new THREE.WebGLRenderer) {
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        return renderer;
    }
}