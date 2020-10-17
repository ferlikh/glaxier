import { Animation } from "./animation";

export class AnimationGroup {
    constructor(readonly animations: Animation[]) {}

    play() {
        this.animations.forEach(animation => animation.play());
    }

    stop() {
        this.animations.forEach(animation => animation.stop());
    }
}