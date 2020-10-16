import { MouseVector } from 'glaxier';
import { AxesHelper, ArrowHelper, Vector3, Object3D } from 'three';
import { GPUPicker } from './gpu.picker';

interface IAxisIntersect {
    axis: 'x' | 'y' | 'z';
    x?: true;
    y?: true;
    z?: true;
}

const isEngaged = Symbol();
export class ObjectAxesHelper extends AxesHelper {
    intersects: IAxisIntersect;
    public readonly arrowHelperAxes: { x: ArrowHelper, y: ArrowHelper, z: ArrowHelper };
    get arrowHelpers() {
        return [this.arrowHelperAxes.x, this.arrowHelperAxes.y, this.arrowHelperAxes.z];
    }
    get isEngaged() {
        return this[isEngaged];
    }
    constructor(private picker: GPUPicker) {
        super();
        const
            origin = new Vector3(0, 0, 0),
            length = 1,
            headLength = 0.25,
            headWidth = 0.15;

        this[isEngaged] = false;
        this.arrowHelperAxes = {
            x: new ArrowHelper(new Vector3(1, 0, 0), origin, length, 0xff0000, headLength, headWidth),
            y: new ArrowHelper(new Vector3(0, 1, 0), origin, length, 0x00ff00, headLength, headWidth),
            z: new ArrowHelper(new Vector3(0, 0, 1), origin, length, 0x0000ff, headLength, headWidth),
        };

        this.add(...this.arrowHelpers);
        this.type = 'ObjectAxesHelper';
    }

    disengage() {
        this[isEngaged] = false;
    }

    engage() {
        this[isEngaged] = true;
    }
    
    updateIntersections(mouse: MouseVector) {
        const { clientX, clientY } = mouse;
        const pixelRatio = window.devicePixelRatio || 1.0;
        const object = this.picker.pick(clientX * pixelRatio, clientY * pixelRatio, object => {
            switch(object.parent){
                case this.arrowHelperAxes.x:
                case this.arrowHelperAxes.y:
                case this.arrowHelperAxes.z:
                    return true;
            }
            return false;
        });

        if (object) {
            const axis = this.getAxisIntersected(object.parent);

            this.intersects = {
                axis,
                [axis]: true
            };
        }
        else {
            this.intersects = null;
        }

        return this.intersects;
    }

    private getAxisIntersected(arrowHelper: Object3D) {
        switch (arrowHelper) {
            case this.arrowHelperAxes.x:
                return 'x';
            case this.arrowHelperAxes.y:
                return 'y';
            case this.arrowHelperAxes.z:
                return 'z';
        }
    }
}