import Effects from './effects';
import { LuminosityShader, ShaderPass, SceneObject, SceneOptions, Scenes, Utils, WindowManager } from 'glaxier';

const grayStage = scriptSrc => Utils.stageTemplate('FX.gray', scriptSrc);

function grayOptions(options: SceneOptions) {
    const effectGrayScale = new ShaderPass( LuminosityShader );
   return Effects.addPasses(options, [effectGrayScale]);
}

export function grayEffect(scene: SceneObject) {
    return Effects.applyFX(scene, grayOptions);
}

export function grayPass(scene, window?) {
    const { scriptSrc } = Scenes.lookup(scene)
    Utils.stage(grayStage(scriptSrc));
    return WindowManager.load(scene, window);
}