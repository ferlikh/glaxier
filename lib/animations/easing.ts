import { EASINGMODE } from './enums';
/*
*   https://github.com/BabylonJS/Babylon.js/blob/master/src/Animations/easing.ts
*/

export interface IEasingFunction {
    /**
     * Given an input gradient between 0 and 1, this returns the corrseponding value
     * of the easing function.
     * The link below provides some of the most common examples of easing functions.
     * @see https://easings.net/
     * @param gradient Defines the value between 0 and 1 we want the easing value for
     * @returns the corresponding value on the curve defined by the easing function
     */
    ease(gradient: number): number;
}

export abstract class EasingFunction {
    private _easingMode: EASINGMODE;
    get easingMode() { return this._easingMode }
    set easingMode(value) { this._easingMode = value; }
    constructor() { }

    protected abstract core(t);
    ease(t: number) {
        switch (this.easingMode) {
            case EASINGMODE.EASE_IN:
                return this.core(t);
            case EASINGMODE.EASE_OUT:
                return 1 - this.core(1 - t);
        }

        return t < 0.5 ? this.core(t * 2) / 2 : ((1 - this.core((1 - t) * 2)) / 2) + 0.5;
    }
}

export class CircleEase extends EasingFunction implements IEasingFunction {
    core(gradient: number): number {
        gradient = Math.max(0, Math.min(1, gradient));
        return (1.0 - Math.sqrt(1.0 - (gradient * gradient)));
    }
}

export class BackEase extends EasingFunction implements IEasingFunction {
    /**
     * Instantiates a back ease easing
     * @see https://easings.net/#easeInBack
     * @param amplitude Defines the amplitude of the function
     */
    constructor(
        /** Defines the amplitude of the function */
        public amplitude: number = 1) {
        super();
    }

    core(gradient: number): number {
        var num = Math.max(0, this.amplitude);
        return (Math.pow(gradient, 3.0) - ((gradient * num) * Math.sin(3.1415926535897931 * gradient)));
    }
}

export class BounceEase extends EasingFunction implements IEasingFunction {
    /**
     * Instantiates a bounce easing
     * @see https://easings.net/#easeInBounce
     * @param bounces Defines the number of bounces
     * @param bounciness Defines the amplitude of the bounce
     */
    constructor(
        /** Defines the number of bounces */
        public bounces: number = 3,
        /** Defines the amplitude of the bounce */
        public bounciness: number = 2) {
        super();
    }

    core(gradient: number): number {
        var y = Math.max(0.0, this.bounces);
        var bounciness = this.bounciness;
        if (bounciness <= 1.0) {
            bounciness = 1.001;
        }
        var num9 = Math.pow(bounciness, y);
        var num5 = 1.0 - bounciness;
        var num4 = ((1.0 - num9) / num5) + (num9 * 0.5);
        var num15 = gradient * num4;
        var num65 = Math.log((-num15 * (1.0 - bounciness)) + 1.0) / Math.log(bounciness);
        var num3 = Math.floor(num65);
        var num13 = num3 + 1.0;
        var num8 = (1.0 - Math.pow(bounciness, num3)) / (num5 * num4);
        var num12 = (1.0 - Math.pow(bounciness, num13)) / (num5 * num4);
        var num7 = (num8 + num12) * 0.5;
        var num6 = gradient - num7;
        var num2 = num7 - num8;
        return (((-Math.pow(1.0 / bounciness, y - num3) / (num2 * num2)) * (num6 - num2)) * (num6 + num2));
    }
}

export class CubicEase extends EasingFunction {
    core(gradient: number): number {
        return (gradient * gradient * gradient);
    }
}

export class ElasticEase extends EasingFunction implements IEasingFunction {
    /**
     * Instantiates an elastic easing function
     * @see https://easings.net/#easeInElastic
     * @param oscillations Defines the number of oscillations
     * @param springiness Defines the amplitude of the oscillations
     */
    constructor(
        /** Defines the number of oscillations*/
        public oscillations: number = 3,
        /** Defines the amplitude of the oscillations*/
        public springiness: number = 3) {
        super();
    }

    core(gradient: number): number {
        let num2;
        const num3 = Math.max(0.0, this.oscillations);
        const num = Math.max(0.0, this.springiness);

        if (num == 0) {
            num2 = gradient;
        } else {
            num2 = (Math.exp(num * gradient) - 1.0) / (Math.exp(num) - 1.0);
        }
        return (num2 * Math.sin(((6.2831853071795862 * num3) + 1.5707963267948966) * gradient));
    }
}

export class ExponentialEase extends EasingFunction implements IEasingFunction {
    /**
     * Instantiates an exponential easing function
     * @see https://easings.net/#easeInExpo
     * @param exponent Defines the exponent of the function
     */
    constructor(
        /** Defines the exponent of the function */
        public exponent: number = 2) {
        super();
    }

    core(gradient: number): number {
        if (this.exponent <= 0) {
            return gradient;
        }

        return ((Math.exp(this.exponent * gradient) - 1.0) / (Math.exp(this.exponent) - 1.0));
    }
}

export class PowerEase extends EasingFunction implements IEasingFunction {
    /**
     * Instantiates an power base easing function
     * @see https://easings.net/#easeInQuad
     * @param power Defines the power of the function
     */
    constructor(
        /** Defines the power of the function */
        public power: number = 2) {
        super();
    }

    core(gradient: number): number {
        var y = Math.max(0.0, this.power);
        return Math.pow(gradient, y);
    }
}

export class QuadraticEase extends EasingFunction implements IEasingFunction {
    core(gradient: number): number {
        return (gradient * gradient);
    }
}

export class QuarticEase extends EasingFunction implements IEasingFunction {
    core(gradient: number): number {
        return (gradient * gradient * gradient * gradient);
    }
}

export class QuinticEase extends EasingFunction implements IEasingFunction {
    core(gradient: number): number {
        return (gradient * gradient * gradient * gradient * gradient);
    }
}

export class SineEase extends EasingFunction implements IEasingFunction {
    core(gradient: number): number {
        return (1.0 - Math.sin(1.5707963267948966 * (1.0 - gradient)));
    }
}

// namespace for easing
export class Easings {
    static back(amplitude: number = 1) { return new BackEase(amplitude); }
    static bounce(bounces: number = 3, bounciness: number = 2) { return new BounceEase(bounces, bounciness); }
    static circle() { return new CircleEase(); }
    static cubic() { return new CubicEase(); }
    static elastic(oscillations:number = 3, springiness:number = 3) { return new ElasticEase(oscillations, springiness); }
    static exponential(exponent: number = 2) { return new ExponentialEase(exponent) };
    static power(power: number = 2) { return new PowerEase(power) };
    static quadratic() { return new QuadraticEase(); }
    static quartic() { return new QuarticEase(); }
    static quntic() { return new QuinticEase(); }
    static sine() { return new SineEase(); }
}