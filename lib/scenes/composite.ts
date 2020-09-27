import { Renderer } from 'three';
import { Scene, SceneOptions, } from './scene';

export class ComposableScene extends Scene {

}

export interface CompositeSceneOptions extends SceneOptions {
    loops: Function[];
    setups: Function[];
}

export class CompositeScene extends ComposableScene {
    readonly loop: Function;
    readonly setup: Function;
    readonly renderer: Renderer;
    private bang: boolean; // should render or not
    constructor(options: CompositeSceneOptions) {
        const { attached } = options;
        options.attached = false;

        super(options);

        const { proxy, renderer } = this.proxyRendering();
        this.renderer = proxy;

        const setup = function() {
            const setups = options.setups.slice();
            while(setups.length) setups.shift().call(this);
        }

        const loop = function() {
            const loops = options.loops.slice();
            while(loops.length) loops.shift().call(this);
            if(this.bang) {
                // renderer.render(this.scene, this.camera);
                this.composer.render();
                this.bang = false;
            }
        }

        this.loop = loop;
        this.setup = setup;

        this.options.loop = loop;
        this.options.setup = setup;

        if(attached) this.attach();
    }

    private proxyRendering() {
        const self = this;
        const { renderer } = this;
        const proxyRender = new Proxy(renderer.render, {
            apply(target, thisArg, params) {
                self.bang = true;
            }
        });
        const proxy = new Proxy(renderer, {
            get(target, prop) {
                return prop === 'render'? proxyRender: target[prop];
            }
        });
        return { proxy, renderer }
    }
}