import { EffectComposer, Pass, RenderPass } from 'glaxier';
import { Symbols } from 'glaxier/symbols';
import * as THREE from 'three';

export type SceneObject = (Scene | SceneOptions);

export type Props = { [name: string]: PropertyDescriptor };

export interface SceneOptions {
    camera?: THREE.Camera;
    effects?: Pass[];
    objects?: THREE.Object3D[];
    props?: Props;
    renderer?: THREE.Renderer;
    loop?: Function;
    setup?: Function;
    attached?: boolean;
    container?: HTMLElement;
}

const INVALID_PROPS_REGISTRY = ['__scn__', 'scene', 'scenes',
    'setup', 'setups', 'loop', 'loops', '_attached', 'attached',
    'renderer', 'container', 'camera', 'objects', 'effects', 'props', 'options',
    'lights', 'meshes', 'attach'].reduce((dict, propName) => {
        dict[propName] = true;
        return dict;
    }, {});

export class Scene {
    readonly __scn__ = Symbols.SCENE;
    readonly composer: EffectComposer;
    readonly renderer: THREE.Renderer;
    readonly scene: THREE.Scene;
    readonly camera: THREE.Camera;
    readonly effects: Pass[];
    readonly objects: THREE.Object3D[];
    readonly props: Props;
    readonly loop: Function;
    readonly setup: Function;
    readonly container?: HTMLElement;

    private _attached: boolean;
    get attached() { return this._attached };
    get lights() {
        return this.objects.filter(o => o.type.includes('Light'));
    }
    get meshes() {
        return this.objects.filter(o => o.type.includes('Mesh'));
    }

    constructor(readonly options: SceneOptions) {
        const scene = this.scene = new THREE.Scene;
        const { renderer, camera, objects, effects, props, setup, loop, attached, container } = options;

        if (props) {
            this.props = props;
            Object.entries(props).filter(([name,]) => !INVALID_PROPS_REGISTRY[name])
                .forEach(([name, prop]) => Object.defineProperty(this, name, prop));
        }

        if (renderer) {
            this.renderer = renderer;
        }
        else {
            this.renderer = new THREE.WebGLRenderer;
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }

        this.camera = camera;
        this.container = container;
        this.objects = objects ?? [];

        if (this.objects.length) this.scene.add(...this.objects);

        if (effects) {
            this.composer = new EffectComposer(this.renderer as THREE.WebGLRenderer);
            this.effects = effects;

            this.composer.addPass(new RenderPass(scene, camera));
            for (const effect of effects) this.composer.addPass(effect);
        }

        // Attach the setup + animation loop
        if (setup) {
            this.setup = setup;
        }

        if (loop) {
            this.loop = loop;
        }

        if (attached) {
            this.attach();
        }
    }

    attach() {
        if (!this.attached) {
            if (this.setup) this.setup.call(this);
            const renderer = this.renderer as THREE.WebGLRenderer;
            renderer.setAnimationLoop(this.loop.bind(this));
            const container = this.container ?? document.body;
            container.appendChild(this.renderer.domElement);
            this._attached = true;
        }
    }
}

