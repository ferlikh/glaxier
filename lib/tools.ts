/**
 * A namespace for scene helpers.
 */
import * as THREE from 'three';

export class Tools {
    static parameterize(object) {
        return (keys?) => {
            if(Array.isArray(keys) && keys.length) {
                return keys.reduce((dict, key) => {
                    dict[key] = { ...object };
                    return dict;
                }, {});
            } 
            return {...object};
        }
    }
    static renderer(renderer = new THREE.WebGLRenderer) {
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        return renderer;
    }
}