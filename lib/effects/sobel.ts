import Effects from './effects';
import { LuminosityShader, SobelOperatorShader, ShaderPass, Scene, SceneObject, SceneOptions, Scenes, Utils, WindowManager } from 'glaxier';

const sobelStage = scriptSrc => `
<html>
    <head>
        <title>Dynamic Rendered Scene</title>
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
            FX.sobel(render()).attach();
        </script>
    </body>
</html>`;

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
    const { scriptSrc } = Scenes.lookup(scene)
    Utils.stage(sobelStage(scriptSrc));
    return WindowManager.load(scene, window);
}