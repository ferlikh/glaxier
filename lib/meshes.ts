import * as THREE from 'three';
import { Vector3Options } from './utils';

export interface MeshConfigOptions {
    position?: Vector3Options;
    rotation?: Vector3Options;
}

export class Meshes {
    static mesh<G extends (THREE.Geometry | THREE.BufferGeometry), M extends THREE.Material>(geometry: G, material: M, config?) {
        const mesh = new THREE.Mesh(geometry, material);
        if(config) {
            Object.entries(config).forEach(([prop, options]) => {
                Object.assign(mesh[prop], options);
            });
        }
        return mesh;
    }
}