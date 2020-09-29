import Scenes from './scenes';
import { Utils } from 'glaxier/utils';
import { WindowManager } from 'glaxier/window-manager';

export function render(scene, window?) {
    const { scriptSrc } = Scenes.lookup(scene)
    Utils.stage(dynamicScene(scriptSrc));
    return WindowManager.load(scene, window);
}

const dynamicScene = scriptSrc => `
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
            const $scene = Scenes.create(render());
            $scene.attach();
        </script>
    </body>
</html>`;