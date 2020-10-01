import Scenes from './scenes';

export function render(scene, window?) {
    return Scenes.run('Scenes.create', scene, window);
}