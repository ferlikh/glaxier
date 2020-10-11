import { exposable } from './exposables';
import { VRButton } from './externals';
import { Scene } from './scenes';
import { Settable } from './utils';
import { Vector2 } from 'three';

const defaultExpose = (object: Settable, value) => {
    object.set(value);
}
export const autoExpose = (name: string, object: Settable | Function, init?: Function | any) => {
    const setter = object instanceof Function ?
        value => object(value) :
        value => defaultExpose(object, value);
    init = init && init instanceof Function && !(object instanceof Function) ? init.bind(object) : init;
    exposable(window, name)(setter, init);
}

const defaultResize = (scene: Scene) => {
    const { composer, renderer } = scene;
    const camera = scene.camera as THREE.PerspectiveCamera,
        width = window.innerWidth, height = window.innerHeight;

    if (composer) composer.setSize(width, height);
    renderer.setSize(width, height);

    if (camera) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}
export const autoResize = (scene: Scene, customResize?: (aspect: number) => void) => {
    const resizeFn = !customResize ?
        defaultResize.bind(null, scene) // default behavior
        : customResize.bind(scene); // custom callback
    window.addEventListener('resize', () => resizeFn(window.innerWidth / window.innerHeight), false);
}

const defaultVRButton = (renderer: THREE.WebGLRenderer) => {
    document.body.appendChild(VRButton.createButton(renderer));
    renderer.xr.enabled = true;
}
export const autoVRButton = renderer => defaultVRButton(renderer);

export const autoKeySwitch = (object, config, matchCase = false) => {
    const keys = Object.keys(config);
    if (!matchCase) {
        keys.filter(k => k.length === 1).forEach(key => {
            const upper = key.toUpperCase(),
                lower = key.toLowerCase();

            if (!(lower in config)) {
                config[lower] = config[upper];
            }
            else if (!(upper in config)) {
                config[lower] = config[upper];
            }

        })
    }
    window.addEventListener('keydown', event => {
        const values = config[event.key]
        if (!values) return;
        Object.entries(values)
            .forEach(([prop, target]) => object[prop] = target);
    });
}

export class MouseVector extends Vector2 {
    clientX: number;
    clientY: number;
}

export const autoMouse = scope => {
    const mouse = new MouseVector();
    Object.defineProperty(scope, 'mouse', {
        value: mouse,
        enumerable: true
    });
    // const 
    //     canvas = scope.renderer.domElement,
    //     rect = canvas.getBoundingClientRect();
    window.addEventListener('mousemove', event => {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        mouse.clientX = event.clientX;
        mouse.clientY = event.clientY;
        // mouse.x = (event.clientX - rect.left) * canvas.width  / rect.width;
        // mouse.y = (event.clientY - rect.top ) * canvas.height / rect.height;
    });
}