import { Scene, SceneOptions } from './scene';

export interface MultiSceneOptions extends SceneOptions {
    scenes: THREE.Scene[];
}

export class MultiScene extends Scene {

}