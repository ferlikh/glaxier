import Effects from './effects';
import { LuminosityShader, ShaderPass, SceneObject, SceneOptions, Scenes } from 'glaxier';

function grayOptions(options: SceneOptions) {
    const effectGrayScale = new ShaderPass( LuminosityShader );
   return Effects.addPasses(options, [effectGrayScale]);
}

export function grayEffect(scene: SceneObject) {
    return Effects.applyFX(scene, grayOptions);
}

export function grayPass(scene, window?) {
    return Scenes.run('FX.gray', scene, window);
}