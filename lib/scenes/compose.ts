import Scenes from './scenes';
import { Renderer } from 'three';
import { Scene, SceneOptions } from './scene';
import { Utils, WindowManager } from 'glaxier';

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
                renderer.render(this.scene, this.camera);
                this.bang = false;
            }
        }

        this.loop = loop;
        this.setup = setup;

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

export type SceneObject = (Scene | SceneOptions);


export function compose(windowManager: WindowManager) {
    return function compose(...scenes) {
        Utils.stage(dynamicComposedScene(scenes));
        return windowManager.open({ name: 'composed', src: Utils.stagingFile });
    }
}

export function makeComposable(...scenes) {

    let camera;
    const effects = [], objects = [], loops = [], setups = [];

    const compiled = compileScenes(scenes);
    for(const scene of compiled) {
        const { loop, setup } = scene;

        camera = scene.camera;
        loops.push(loop);
        setups.push(setup);
        [].push.apply(effects, scene.effects ?? []);
        [].push.apply(objects, scene.objects ?? []);
    }

    return new CompositeScene({
        attached: true,
        camera, effects, objects, loops, setups,
    });

}

function compileScenes(scenes): SceneObject[] {
    const sources = scenes.map(scene => Scenes.lookup(scene).moduleImport);
    const src = "[" + sources.map(source => `require('${source}').render()`).join(', ') + "]";
    return eval(src);
}

const dynamicComposedScene = sources => `
<html>
    <head>
        <title>Dynamic Composed Scene</title>
        <style>
            body { margin: 0; }
            canvas { display: block; }
        </style>
    </head>
    <body>
        <script src="dist://vendors.js"></script>
        <script src="dist://lib.js"></script>
        <script>
            const scene = makeComposable(${sources.map(src => `'${src}'`).join(', ')})
            console.log(scene)
        </script>
    </body>
</html>`;