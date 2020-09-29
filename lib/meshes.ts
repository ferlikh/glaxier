import * as THREE from 'three';
import { Utils, Object3DOptions } from './utils';

export class Meshes {
    static mesh<G extends (THREE.Geometry | THREE.BufferGeometry), M extends THREE.Material>(geometry: G, material: M, config?: Object3DOptions) {
        const mesh = new THREE.Mesh(geometry, material);
        return Utils.configure(mesh, config);
    }
}