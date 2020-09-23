import * as THREE from 'three';

export class Materials {
    static meshBasic(parameters?: THREE.MeshBasicMaterialParameters) {
        return new THREE.MeshBasicMaterial(parameters);
    }

    static meshStd(parameters?: THREE.MeshStandardMaterialParameters) {
        return new THREE.MeshStandardMaterial(parameters);
    }

    static meshToon(parameters?: THREE.MeshToonMaterialParameters) {
        return new THREE.MeshToonMaterial(parameters);
    }
}