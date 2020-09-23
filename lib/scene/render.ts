import { Scenes } from './scene';
import { Utils } from 'glaxier/util';
import { WindowManager } from 'glaxier/window-manager';

export function render(windowManager: WindowManager) {
    return function render(scene, window?) {
        
        const { scriptSrc } = Scenes.lookup(scene)
        Utils.stage(dynamicScene(scriptSrc));

        if(typeof window === 'string') {
            window = windowManager.windows[window];
        }

        return window ?
            windowManager.loadWindow(window, Utils.stagingFile) :
            windowManager.open({ name: scene, src: Utils.stagingFile });
    }
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
        <script src="dist://lib.js"></script>
        <script src="dist://${scriptSrc}"></script>
        <script>
            Scenes.toScene(render()).attach();
        </script>
    </body>
</html>`;