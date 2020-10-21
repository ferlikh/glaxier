/*
*    A namespace for vector functions
*/

import { Vector2, Vector3 } from 'three';

export interface IVector2 {
    x: number;
    y: number;
}

export interface IVector3 {
    x: number;
    y: number;
    z: number;
}

export class Vectors {
    static distance(u: Vector2, v: Vector2, basis?: Vector2) {
        const 
            { x: x1, y: y1 } = u,
            { x: x2, y: y2 } = v;
        const dX = x2 - x1, dY = y2 - y1;

        return Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2))
            * Vectors.sign(basis, new Vector2(dX, dY));
    }

    static lerp2(start: IVector2, end: IVector2, amount: number) {
        const x = start.x + ((end.x - start.x) * amount);
        const y = start.y + ((end.y - start.y) * amount);
        return new Vector2(x, y);
    }

    static lerp3(start: IVector3, end: IVector3, amount: number) {
        const x = start.x + ((end.x - start.x) * amount);
        const y = start.y + ((end.y - start.y) * amount);
        const z = start.z + ((end.z - start.z) * amount);
        return new Vector3(x, y, z);
    }

    static sign(src, dest) {
        if (!dest) return 1;
        else if (!src || (src.x === 0 || src.y === 0)) 
            return dest.x + dest.y >= 0 ? +1 : -1;
        return src.dot(dest) >= 0 ? +1 : -1;
    }

    static unit(axis: 'x' | 'y' | 'z') {
        switch (axis) {
            case 'x': return new Vector3(1, 0, 0);
            case 'y': return new Vector3(0, 1, 0);
            case 'z': return new Vector3(0, 0, 1);
        }
    }
}