import path from 'path';
import { Utils } from 'glaxier/util';
import * as THREE from 'three';

export interface SceneOptions {
    camera: THREE.Camera;
    meshes: THREE.Mesh[];
    renderer?: THREE.Renderer;
    loop?: Function;
    setup?: Function;
    attached?: boolean;
}

export class Scene {
    // readonly __scn__ = true;
    readonly __scn__ = Scenes.sceneKey;
    protected readonly renderer: THREE.Renderer;
    protected readonly scene: THREE.Scene;
    public readonly camera: THREE.Camera;
    public readonly meshes: THREE.Mesh[];
    public readonly loop: Function;
    public readonly setup: Function;
    private _attached: boolean;
    get attached() { return this._attached };
    constructor(public readonly options: SceneOptions) {
        this.scene = new THREE.Scene;
        if (options.renderer) {
            this.renderer = options.renderer;
        }
        else {
            this.renderer = new THREE.WebGLRenderer;
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
        this.camera = options.camera;
        this.meshes = options.meshes ?? [];
        this.scene.add(...this.meshes);

        // Run the preload
        if (options.setup) {
            this.setup = options.setup;
        }

        // Attach the animation loop
        if (options.loop) {
            this.loop = options.loop;
        }

        if (options.attached) {
            this.attach();
        }
    }

    attach() {
        if (!this.attached) {
            if(this.setup) this.setup.call(this);
            const renderer = this.renderer as THREE.WebGLRenderer;
            renderer.setAnimationLoop(this.loop.bind(this));
            document.body.appendChild(this.renderer.domElement);
            this._attached = true
        }
    }
}

export class Scenes {
    static readonly sceneKey = Symbol('Scene');
    static isScene(object): object is Scene {
        // return object.__scn__;
        return object.__scn__ === this.sceneKey;
    }

    static toScene(object: SceneOptions | Scene) {
        const isScene = Scenes.isScene(object);
        if(isScene) {
            return object;
        }
        else {
            return new Scene(object as SceneOptions);
        }
    }

    static lookup(scene) {
        const ext = path.extname(scene);
        let fileName = scene;

        if(!ext) fileName += '.js';
        else if(ext !== '.js') {
            throw new TypeError('scene function only expects .js files, please try another method');
        }

        return Utils.lookup(fileName);
    }
}