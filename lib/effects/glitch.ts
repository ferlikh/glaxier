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
    let { effects } = options;
    const glitchPass = new GlitchPass;
    if(!Array.isArray(effects)) 
        effects = [glitchPass];
    else effects.push(glitchPass);
    return { ...options, effects };
}

export function glitchEffect(scene: SceneObject) {
    if(Scenes.isScene(scene)) {
        const { options } = scene as Scene;
        return Scenes.toComposite(glitchOptions(options));
    }
    return Scenes.toComposite(glitchOptions(scene));
}


export function glitch(scene, window?) {
    const { scriptSrc } = Scenes.lookup(scene)
    Utils.stage(glitchStage(scriptSrc));

    if (typeof window === 'string') {
        window = WindowManager.windows[window];
    }

    return window ?
        WindowManager.loadWindow(window, Utils.stagingFile) :
        WindowManager.open({ name: scene, src: Utils.stagingFile });
}