import Effects from './effects';
import { GlitchPass, SceneObject, SceneOptions, Scenes, Utils, WindowManager } from 'glaxier';

const glitchStage = scriptSrc => Utils.stageTemplate('FX.glitch', scriptSrc);

function glitchOptions(options: SceneOptions) {
   return Effects.addPasses(options, [new GlitchPass]);
}

export function glitchEffect(scene: SceneObject) {
    return Effects.applyFX(scene, glitchOptions);
}


export function glitchPass(scene, window?) {
    const { scriptSrc } = Scenes.lookup(scene)
    Utils.stage(glitchStage(scriptSrc));
    return WindowManager.load(scene, window);
}