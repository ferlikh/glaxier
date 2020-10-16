import { Utils } from "glaxier/utils";
import { Animatable } from "./animatable";
import { ANIMATIONLOOPMODE, ANIMATIONTYPE } from './enums';

export class Animation extends Animatable {

    private _callback: Function;
    get callback() {
        return this._callback;
    }

    set callback(callback) {
        this._callback = callback ? callback : () => { };
    }

    constructor(readonly targetProperty: string, 
        readonly fps: number, 
        readonly dataType: number, 
        readonly loopMode: number = ANIMATIONLOOPMODE.CYCLE) {
        super(fps, dataType, loopMode);
    }

    interpolate() {
        const previousValue = this.currentValue;
        super.interpolate();
        this.callback(previousValue, this.currentValue);
    }

    runEveryFrame(callback: Function) {
        this.callback = callback;
    }

    static targetedInterpolation(target, property, dataType, prev, curr) {
        switch(dataType) {
            case ANIMATIONTYPE.FLOAT:
                // const delta = curr - prev;
                // target[property] += delta;
                target[property] = curr;
                break;
        }
    }

    static interpolator(object, property, dataType) {
        switch(dataType) {
            case ANIMATIONTYPE.FLOAT:
                const targetPropertyPath = property.split('.');
                const target = Utils.propertyParent(object, targetPropertyPath);
                const targetProperty = targetPropertyPath[targetPropertyPath.length - 1];
                return (prev, curr) => Animation.targetedInterpolation(target, targetProperty, dataType, prev, curr);
            default:
                return () => {}
        }
    }
}