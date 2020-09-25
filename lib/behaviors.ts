import exposable from './exposables';
import { VRButton } from './externals';
import { Scene } from './scenes';
import { Settable } from './utils';

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

const defaultResize = (scene: Scene) => {
    const { composer, renderer } = scene;
    const camera = scene.camera as THREE.PerspectiveCamera,
        width = window.innerWidth, height = window.innerHeight;

    if(composer) composer.setSize(width, height);
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}
export const autoResize = scene => window.addEventListener('resize', () => defaultResize(scene));

const defaultVRButton = (renderer: THREE.WebGLRenderer) => {
    document.body.appendChild(VRButton.createButton(renderer));
    renderer.xr.enabled = true;
}
export const autoVRButton = renderer => defaultVRButton(renderer);