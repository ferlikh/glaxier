import { Renderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
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
    readonly composer: EffectComposer;
    readonly renderer: Renderer;
    private bang: boolean; // should render or not
    constructor(options: CompositeSceneOptions) {
        const { attached } = options;
        options.attached = false;

        super(options);

        const { renderer, composer, proxies } = proxyRendering(this);
        this.composer = proxies.composer;
        this.renderer = proxies.renderer;

        const setup = function () {
            const setups = options.setups.slice();
            while (setups.length) setups.shift().call(this);
        }

        const loop = function () {
            const loops = options.loops.slice();
            while (loops.length) loops.shift().call(this);
            if (this.bang) {
                // renderer.render(this.scene, this.camera);
                composer.render();
                this.bang = false;
            }
        }

        this.loop = loop;
        this.setup = setup;

        this.options.loop = loop;
        this.options.setup = setup;

        if (attached) this.attach();
    }
}

function proxyRenderer(object, renderProxy) {
    return new Proxy(object, {
        get(target, prop) {
            return prop === 'render' ? renderProxy : target[prop];
        }
    });
}

function proxyRendering(self) {
    const { composer, renderer } = self;
    const renderProxy = new Proxy(renderer.render, {
        apply(target, thisArg, params) {
            self.bang = true;
        }
    });
    const proxies = {
        composer: proxyRenderer(composer, renderProxy),
        renderer: proxyRenderer(renderer, renderProxy),
    }

    return { composer, renderer, proxies }
}