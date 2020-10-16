import { IAnimationKey } from './animationKey';
import { Animation } from './animation';


export class Animations {
    static basic(object, property, fps, dataType, loopMode, keyFrames) {
        const animation = new Animation(property, fps, dataType, loopMode);
        animation.setKeys(keyFrames);
        animation.runEveryFrame(Animation.interpolator(object, property, dataType));
        return animation;
    }
}