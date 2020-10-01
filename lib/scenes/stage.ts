import Scenes from './scenes';

export function stage(scene, window?) {
    return Scenes.run('Scenes.stage', scene, window);
}