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
        // const previousValue = this.currentValue;
        super.interpolate();
        this.callback(this.currentValue);
    }

    runEveryFrame(callback: Function) {
        this.callback = callback;
    }

    static targetedInterpolation(target, property, dataType, value) {
        switch(dataType) {
            case ANIMATIONTYPE.FLOAT:
                // const delta = curr - prev;
                // target[property] += delta;
                target[property] = value;
                break;
            case ANIMATIONTYPE.VECTOR2:
                target[property].x = value.x;
                target[property].y = value.y;
                break;
        }
    }

    static interpolator(object, property, dataType) {
        const targetPropertyPath = property.split('.');
        const target = Utils.propertyParent(object, targetPropertyPath);
        const targetProperty = targetPropertyPath[targetPropertyPath.length - 1];
        switch(dataType) {
            case ANIMATIONTYPE.FLOAT:
            case ANIMATIONTYPE.VECTOR2:
                return value => Animation.targetedInterpolation(target, targetProperty, dataType, value);
            default:
                return () => {}
        }
    }
}