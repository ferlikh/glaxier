import { Scene, SceneOptions, Scenes } from 'glaxier';
import { Pass } from 'glaxier/externals';

/**
 * A namespace for effects utilities.
 */

export default class Effects {

    static addPasses(options: SceneOptions, passes: Pass[]) {
        let { effects } = options;
        if(!Array.isArray(effects)) 
            effects = passes;
        else [].push.apply(effects, passes);
        return { ...options, effects };
    }

    static applyFX(scene: SceneOptions, effectOptions: Function) {
        if(Scenes.isScene(scene)) {
            const { options } = scene as Scene;
            return Scenes.toComposite(effectOptions(options));
        }
        return Scenes.toComposite(effectOptions(scene));
    }
}