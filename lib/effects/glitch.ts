import Effects from './effects';
import { GlitchPass, Scene, SceneObject, SceneOptions, Scenes, Utils, WindowManager } from 'glaxier';

const glitchStage = scriptSrc => `
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
            FX.glitch(render()).attach();
        </script>
    </body>
</html>`;

function glitchOptions(options: SceneOptions) {
   return Effects.addPasses(options, [new GlitchPass]);
}

export function glitchEffect(scene: SceneObject) {
    if(Scenes.isScene(scene)) {
        const { options } = scene as Scene;
        return Scenes.toComposite(glitchOptions(options));
    }
    return Scenes.toComposite(glitchOptions(scene));
}


export function glitchPass(scene, window?) {
    const { scriptSrc } = Scenes.lookup(scene)
    Utils.stage(glitchStage(scriptSrc));
    return WindowManager.load(scene, window);
}