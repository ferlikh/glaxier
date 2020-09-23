import * as THREE from 'three';

export function mesh<G extends THREE.Geometry, M extends THREE.Material>(geometry: G, material: M){
    return new THREE.Mesh(geometry, material);
}