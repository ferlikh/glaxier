import { AxesHelper, ArrowHelper, Raycaster, Vector3, Object3D } from 'three';

const isEngaged = Symbol();
export class ObjectAxesHelper extends AxesHelper {
    intersects: any;
    public readonly raycaster: Raycaster = new Raycaster;
    public readonly arrowHelpers: { x: ArrowHelper, y: ArrowHelper, z: ArrowHelper };
    get arrowHelpersList() {
        return [this.arrowHelpers.x, this.arrowHelpers.y, this.arrowHelpers.z];
    }
    get isEngaged() {
        return this[isEngaged];
    }
    constructor() {
        super();
        const
            origin = new Vector3(0, 0, 0),
            length = 1,
            headLength = 0.25,
            headWidth = 0.15;

        this[isEngaged] = false;
        this.arrowHelpers = {
            x: new ArrowHelper(new Vector3(1, 0, 0), origin, length, 0xff0000, headLength, headWidth),
            y: new ArrowHelper(new Vector3(0, 1, 0), origin, length, 0x00ff00, headLength, headWidth),
            z: new ArrowHelper(new Vector3(0, 0, 1), origin, length, 0x0000ff, headLength, headWidth),
        };

        this.add(...this.arrowHelpersList);
        this.type = 'ObjectAxesHelper';
    }

    private getAxisIntersected(arrowHelper: Object3D) {
        switch (arrowHelper) {
            case this.arrowHelpers.x:
                return 'x';
            case this.arrowHelpers.y:
                return 'y';
            case this.arrowHelpers.z:
                return 'z';
        }
    }

    updateIntersections(mouse, camera) {
        this.raycaster.setFromCamera(mouse, camera);
        const
            intersects = this.raycaster.intersectObjects(this.arrowHelpersList.map(arrow => arrow.children[1])),
            hit = intersects[0];

        if (hit) {
            const 
                arrowHelper = hit.object.parent,
                axis = this.getAxisIntersected(arrowHelper);
                
            this.intersects = {
                axis,
                x: axis === 'x',
                y: axis === 'y',
                z: axis === 'z',
            };
        }
        else {
            this.intersects = null;
        }

        return this.intersects;
    }

    disengage() {
        this[isEngaged] = false;
    }

    engage() {
        this[isEngaged] = true;
    }
}
