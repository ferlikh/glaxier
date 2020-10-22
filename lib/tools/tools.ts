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
    static renderer(config?: THREE.WebGLRenderer | THREE.WebGLRendererParameters) {
        const renderer = config && config instanceof THREE.WebGLRenderer? 
                config: new THREE.WebGLRenderer(config ?? {});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        return renderer;
    }
}