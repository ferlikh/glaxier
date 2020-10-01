import path from 'path';
import { SceneOptions, Scene, SceneObject } from './types/scene';
import { CompositeScene, CompositeSceneOptions, CompositeSceneObject } from './types/composite';
import { MultiScene, MultiSceneOptions } from './types/multi';
import { Utils } from 'glaxier';
import { Symbols } from 'glaxier/symbols';
import { BrowserWindow } from 'electron';
import { WindowManager } from 'glaxier/window-manager';

export default class Scenes {
    static readonly sceneKey = Symbols.SCENE;
    static isScene(object): object is Scene {
        return object.__scn__ === this.sceneKey;
    }

    static create(object: SceneObject | CompositeSceneOptions | MultiSceneOptions) {
        const isScene = Scenes.isScene(object);
        if (isScene) return object;
        // scene options
        else if('loops' in object) {
            return new CompositeScene(object);
        }
        else if('scenes' in object) {
            return new MultiScene(object);
        }
        return new Scene(object as SceneOptions);
    }

    static lookup(scene) {
        const ext = path.extname(scene);
        let fileName = scene;

        if (!ext) fileName += '.js';
        else if (ext !== '.js') {
            throw new TypeError('scene function only expects .js files, please try another method');
        }

        return Utils.lookup(fileName);
    }

    static compose(...scenes) {
        let camera, container;
        const effects = [], objects = [], props = {}, loops = [], setups = [];

        const compiled = Scenes.compile(scenes);
        for (const scene of compiled) {
            const { loop, setup } = scene;

            loops.push(loop);
            setups.push(setup);
            camera = scene.camera ?? camera;
            container = scene.container ?? container;
            [].push.apply(effects, scene.effects ?? []);
            [].push.apply(objects, scene.objects ?? []);
            Object.assign(props, scene.props ?? {});
        }

        return new CompositeScene({
            attached: true, container,
            camera, effects, objects, props, loops, setups,
        });
    }

    static run(transform: string, scene: string | BrowserWindow | Promise<BrowserWindow>, window?: BrowserWindow) {
        if(scene instanceof BrowserWindow || scene instanceof Promise) {
            const code = `$scene = Scenes.reassemble($scene, '${transform}').attach(); (void 0)`;
            return Utils.runInWindow(scene, code);
        }
        else {
            const { scriptSrc } = Scenes.lookup(scene);
            if(!scriptSrc) {
                console.error(`${scene} not found`);
                return;
            }
            Utils.stage( Scenes.template(transform, scriptSrc) );
            return WindowManager.load(scene, window);
        }
    }

    static stage(scene: SceneObject) {
        return Scenes.augment(scene, { controls: true });
    }

    static toComposite(scene: SceneObject | CompositeSceneObject) {
        if('loops' in scene) return new CompositeScene(scene);
        else if ('options' in scene && 'loops' in scene.options) return scene;

        const { camera, loop, setup } = scene;
        const loops = [loop];
        const setups = setup? [setup]: [];
        const effects = scene.effects? [...scene.effects]: [];
        const objects = scene.objects? [...scene.objects]: [];
        const options = Scenes.isScene(scene)? scene.options: scene;
        return new CompositeScene({
            ...options,
            camera, effects, objects, loops, setups,
        });
    }

    private static augment(scene: SceneObject, options: SceneOptions) {
        return Scenes.create({ ...(Scenes.isScene(scene)? scene.options: scene), ...options });
    }

    private static compile(scenes): SceneObject[] {
        const sources = scenes.map(scene => Scenes.lookup(scene).moduleImport);
        return eval("[" + sources.map(source => `require('${source}').render()`).join(', ') + "]");
    }

    private static reassemble(scene: Scene, transform: string) {
        if(!transform.match(/^\w+\.\w+$/)) return;
        const options = scene.detach();
        return eval(transform)({ ...options, setup: undefined, setups: [] });
    }

    private static template(transform, src) {
        return sceneTemplate(src, `$scene = ${transform}(render()).attach();`);
    }
}

const sceneTemplate = (scriptSrc, code) => `
<html>
    <head>
        <title>Rendered Scene</title>
        <style>
            body { margin: 0; }
            canvas { display: block; }
        </style>
    </head>
    <body>
        <script src="dist://vendors.js"></script>
        <script src="dist://renderer-lib.js"></script>
        <script src="dist://${scriptSrc}"></script>
        <script>
            ${code}
        </script>
    </body>
</html>`