import { AnimatableValue } from "./animatableValue";
import { IAnimationKey } from "./animationKey";

export class KeyFrames {
    static make(values: AnimatableValue[], fps: number = 1): IAnimationKey[] {
        return values.map((value, i) => {
            const frame = i * fps;
            return { frame, value };
        });
    }
} 