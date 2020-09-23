import exposable from './exposable';
import { VRButton } from './external';
import { Settable } from './util';

const defaultExpose = (object: Settable, value) => {
    object.set(value);
}
export const autoExpose = (name: string, object: Settable | Function, init?: Function | any) => {
    const setter = object instanceof Function? 
        value => object(value): 
        value => defaultExpose(object, value);
    init = init && init instanceof Function && !(object instanceof Function)? init.bind(object): init;
    exposable(window, name)(setter, init);
}

const defaultResize = (renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}
export const autoResize = (renderer, camera) => window.addEventListener('resize', () => defaultResize(renderer, camera));

const defaultVRButton = (renderer: THREE.WebGLRenderer) => {
    document.body.appendChild(VRButton.createButton(renderer));
    renderer.xr.enabled = true;
}
export const autoVRButton = renderer => defaultVRButton(renderer);