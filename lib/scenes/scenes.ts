import path from 'path';
import { SceneOptions, Scene } from './scene';
import { Utils } from 'glaxier';
import { Symbols } from 'glaxier/symbols';

export default class Scenes {
    static readonly sceneKey = Symbols.SCENE;
    static isScene(object): object is Scene {
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