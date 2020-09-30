import Scenes from './scenes';
import { Utils } from 'glaxier/utils';
import { WindowManager } from 'glaxier/window-manager';

export function render(scene, window?) {
    const { scriptSrc } = Scenes.lookup(scene)
    Utils.stage(dynamicScene(scriptSrc));
    return WindowManager.load(scene, window);
}

const dynamicScene = scriptSrc => Utils.stageTemplate('Scenes.create', scriptSrc);