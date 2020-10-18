import { IAnimationKey } from './animationKey';
import { IEasingFunction } from './easing';
import { ANIMATIONTYPE, ANIMATIONLOOPMODE } from './enums';

type AnimatableValue = number;

// a value animated by an array of keyFrames
export class Animatable {
    protected currentFrame: number;
    protected currentValue: AnimatableValue;
    private easingFn: IEasingFunction;
    private keyFrames: IAnimationKey[];
    private startTime: number;
    private prevIndex: number;
    private nextIndex: number;
    private endIndex: number;
    private frameLimit: number;
    private running: boolean = false;
    private static requestAnimationFrame = window.requestAnimationFrame;

    constructor(readonly fps: number, readonly dataType: number, readonly loopMode: number = ANIMATIONLOOPMODE.CYCLE) { }

    getKeys() {
        return this.keyFrames;
    }

    setKeys(keys: IAnimationKey[]) {
        this.keyFrames = keys;
        this.endIndex = this.keyFrames.length - 1;
        this.frameLimit = this.keyFrames[this.endIndex].frame + 1;
    }

    getEasing() {
        return this.easingFn;
    }

    setEasing(easingFn: IEasingFunction) {
        this.easingFn = easingFn;
    }

    play() {
        if (this.running) return;
        this.running = true;
        this.currentFrame = 0;
        this.currentValue = this.keyFrames[0].value;
        this.prevIndex = 0;
        this.nextIndex = this.keyFrames.length > 1 ? 1 : 0;
        this.startTime = Date.now();
        this.progress();
    }

    stop() {
        if (!this.running) return;
        this.running = false;
        this.currentFrame = null;
        this.currentValue = null;
        this.prevIndex = null;
        this.nextIndex = null;
        this.startTime = null;
    }

    protected interpolate() {
        const
            startFrame = this.keyFrames[this.prevIndex].frame,
            endFrame = this.keyFrames[this.nextIndex].frame,
            startValue = this.keyFrames[this.prevIndex].value,
            endValue = this.keyFrames[this.nextIndex].value;

        if (this.currentFrame === startFrame || this.prevIndex > this.nextIndex) {
            this.currentValue = startValue;
            return;
        }

        const duration = endFrame - startFrame;
        let gradient = (this.currentFrame - startFrame) / duration;

        if(this.easingFn) {
            gradient = this.easingFn.ease(gradient);
        }

        switch (this.dataType) {
            case ANIMATIONTYPE.FLOAT:
                this.currentValue = startValue + ((endValue - startValue) * gradient);
                break;
        }
        // console.log(this.currentFrame, this.currentValue);
    }

    private progress() {
        if (!this.running) return;
        const framesElapsed = Math.round((Date.now() - this.startTime) * this.fps / 1000);

        // frame hasn't changed
        if(framesElapsed % this.frameLimit === this.currentFrame)
            return Animatable.requestAnimationFrame.call(window, this.progress.bind(this));

        this.currentFrame = framesElapsed % this.frameLimit;
        // next key frame was hit
        if (this.currentFrame > this.keyFrames[this.nextIndex].frame) {
            this.prevIndex = this.nextIndex;
            this.nextIndex += 1;
        }
        // end key frame was hit
        else if (this.currentFrame === this.keyFrames[this.endIndex].frame) {
            this.prevIndex = this.nextIndex;
            if (this.loopMode === ANIMATIONLOOPMODE.CONSTANT) {
                this.stop();
                return;
            }
            else {
                this.nextIndex = 0;
            }
        }
        this.interpolate();
        Animatable.requestAnimationFrame.call(window, this.progress.bind(this));
    }
}