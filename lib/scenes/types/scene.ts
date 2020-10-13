import { RESERVED_KEYWORDS } from '../schema/keywords';
import { Symbols } from 'glaxier/symbols';
import { EffectComposer, Pass, RenderPass, OrbitControls, Tools } from 'glaxier';
import * as THREE from 'three';

export type SceneObject = (Scene | SceneOptions);

export type Props = { [name: string]: PropertyDescriptor };

export interface SceneOptions {
    camera?: THREE.Camera;
    effects?: Pass[];
    objects?: THREE.Object3D[];
    props?: Props;
    composer?: EffectComposer;
    renderer?: THREE.Renderer;
    controls?: any;
    loop?: Function;
    setup?: Function;
    attached?: boolean;
    title?: string;
    container?: HTMLElement;
}

export class Scene {
    readonly __scn__ = Symbols.SCENE;
    readonly composer: EffectComposer;
    readonly renderer: THREE.Renderer;
    readonly scene: THREE.Scene;
    readonly camera: THREE.Camera;
    readonly effects: Pass[];
    readonly objects: THREE.Object3D[];
    readonly props: Props;
    readonly controls: any;
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
        const { renderer, composer, camera, objects, effects, props, controls, setup, loop, attached, container } = options;

        if (props) {
            this.props = props;
            Object.entries(props).filter(([name,]) => !RESERVED_KEYWORDS[name])
                .forEach(([name, prop]) => Object.defineProperty(this, name, prop));
        }

        if (renderer) {
            this.renderer = renderer;
        }
        else {
            this.renderer = Tools.renderer();
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
        else if(composer) {
            this.composer = composer;
        }

        if(controls) {
            if(typeof controls !== 'boolean') {
                this.controls = controls;
            }
            else {
                if(!camera) throw new Error('camera is undefined');
                this.controls = new OrbitControls(camera, this.renderer.domElement);
            }
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
            if(this.options.title) {
                let title = document.querySelector('head title');
                title = title ?? document.head.appendChild(document.createElement('title'));
                title.innerHTML = this.options.title;
            }
            const container = this.container ?? document.body;
            container.appendChild(this.renderer.domElement);
            this._attached = true;
        }
        return this;
    }

    detach() {
        if(this.attached) {
            const container = this.container ?? document.body;
            container.removeChild(this.renderer.domElement);
            this._attached = false;
        }
        return this.options;
    }
}

