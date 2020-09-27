import { Utils, WindowManager } from 'glaxier';

export function compose(...scenes) {
    Utils.stage(composedStage(scenes));
    return WindowManager.open({ name: 'composed', src: Utils.stagingFile });
}

const composedStage = sources => `
<html>
    <head>
        <title>Dynamic Composed Scene</title>
        <style>
            body { margin: 0; }
            canvas { display: block; }
        </style>
    </head>
    <body>
        <script src="dist://vendors.js"></script>
        <script src="dist://renderer-lib.js"></script>
        <script>
            const scene = Scenes.compose(${sources.map(src => `'${src}'`).join(', ')})
            console.log(scene)
        </script>
    </body>
</html>`;