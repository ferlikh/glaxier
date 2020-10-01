import Effects from './effects';
import { LuminosityShader, SobelOperatorShader, ShaderPass, SceneObject, SceneOptions, Scenes } from 'glaxier';

function sobelOptions(options: SceneOptions) {
    const effectGrayScale = new ShaderPass( LuminosityShader );
    const effectSobel = new ShaderPass( SobelOperatorShader );
    effectSobel.uniforms.resolution.value.x = window.innerWidth * window.devicePixelRatio;
    effectSobel.uniforms.resolution.value.y = window.innerHeight * window.devicePixelRatio;
   return Effects.addPasses(options, [effectGrayScale, effectSobel]);
}

export function sobelEffect(scene: SceneObject) {
    return Effects.applyFX(scene, sobelOptions);
}

export function sobelPass(scene, window?) {
    return Scenes.run('FX.sobel', scene, window);
}