import path from 'path';
import { SceneOptions, Scene, SceneObject } from './types/scene';
import { CompositeScene, CompositeSceneOptions } from './types/composite';
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

    static run(transform: string, scene: string, window?: BrowserWindow) {
        const { scriptSrc } = Scenes.lookup(scene);
        if(!scriptSrc) {
            console.error(`${scene} not found`);
        }
        const template = Utils.stageTemplate(transform, scriptSrc);
        Utils.stage(template);
        return WindowManager.load(scene, window);
    }

    static stage(scene: SceneObject) {
        return Scenes.augment(scene, { controls: true });
    }

    static toComposite(scene: SceneObject) {
        const { camera, loop, setup } = scene;
        const loops = [loop];
        const setups = [setup];
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
    
}