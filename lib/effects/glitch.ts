import Effects from './effects';
import { GlitchPass, SceneObject, SceneOptions, Scenes } from 'glaxier';

function glitchOptions(options: SceneOptions) {
   return Effects.addPasses(options, [new GlitchPass]);
}

export function glitchEffect(scene: SceneObject) {
    return Effects.applyFX(scene, glitchOptions);
}


export function glitchPass(scene, window?) {
    return Scenes.run('FX.glitch', scene, window);
}