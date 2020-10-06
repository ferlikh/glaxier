import { AxesHelper, ArrowHelper, Vector3 } from 'three';

export class ObjectAxesHelper extends AxesHelper {
    public readonly arrowHelpers: ArrowHelper[];
    constructor() {
        super();
        const
            origin = new Vector3(0, 0, 0),
            length = 1,
            headLength = 0.25,
            headWidth = 0.1;

        this.arrowHelpers = [
            new ArrowHelper(new Vector3(1, 0, 0), origin, length, 0xff0000, headLength, headWidth), // x
            new ArrowHelper(new Vector3(0, 1, 0), origin, length, 0x00ff00, headLength, headWidth), // y
            new ArrowHelper(new Vector3(0, 0, 1), origin, length, 0x0000ff, headLength, headWidth), // z
        ]

        this.add(...this.arrowHelpers);

        this.type = 'ObjectAxesHelper';
    }

}
