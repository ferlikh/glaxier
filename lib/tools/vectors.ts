/*
*    A namespace for vector functions
*/

import { Vector2, Vector3 } from 'three';

export class Vectors {
    static distance(u: Vector2, v: Vector2, direction?: Vector2) {
        const { x: x1, y: y1 } = u;
        const { x: x2, y: y2 } = v;
        const dX = x2 - x1, dY = y2 - y1;
        return Vectors.sign(direction, new Vector2(dX, dY)) * Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    static sign(v, d) {
        if(!v || !d) return 1;
        else if(v.x === 0 && v.y === 0)
            return d.x + d.y >= 0 ? +1 : -1;
        return v.dot(d) >= 0? +1: -1;
    }

    static unit(axis: 'x' | 'y' | 'z') {
        switch (axis) {
            case 'x': return new Vector3(1, 0, 0);
            case 'y': return new Vector3(0, 1, 0);
            case 'z': return new Vector3(0, 0, 1);
        }
    }
}