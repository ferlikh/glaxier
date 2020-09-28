import path from 'path';
import { SceneOptions, Scene, SceneObject } from './scene';
import { CompositeScene } from './composite';
import { Utils } from 'glaxier';
import { Symbols } from 'glaxier/symbols';

export default class Scenes {
    static readonly sceneKey = Symbols.SCENE;
    static isScene(object): object is Scene {
        return object.__scn__ === this.sceneKey;
    }

    static toScene(object: SceneObject) {
        const isScene = Scenes.isScene(object);
        if (isScene) {
            return object;
        }
        else {
            return new Scene(object as SceneOptions);
        }
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

    static toComposite(scene: SceneObject) {
        const { camera, loop, setup } = scene;
        const loops = [loop];
        const setups = [setup];
        const effects = scene.effects? [...scene.effects]: [];
        const objects = scene.objects? [...scene.objects]: [];
        return new CompositeScene({
            camera, effects, objects, loops, setups,
        });
    }

    static compose(...scenes) {
        let camera;
        const effects = [], objects = [], props = {}, loops = [], setups = [];

        const compiled = Scenes.compile(scenes);
        for (const scene of compiled) {
            const { loop, setup } = scene;

            camera = scene.camera;
            loops.push(loop);
            setups.push(setup);
            [].push.apply(effects, scene.effects ?? []);
            [].push.apply(objects, scene.objects ?? []);
            Object.assign(props, scene.props ?? {});
        }

        return new CompositeScene({
            attached: true,
            camera, effects, objects, loops, setups,
        });
    }

    private static compile(scenes): SceneObject[] {
        const sources = scenes.map(scene => Scenes.lookup(scene).moduleImport);
        return eval("[" + sources.map(source => `require('${source}').render()`).join(', ') + "]");
    }
}