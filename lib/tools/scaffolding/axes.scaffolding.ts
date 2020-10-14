import { GPUPicker, ObjectAxesHelper } from '../helpers';
import { Scene, Vectors } from 'glaxier';
import { Object3D, PerspectiveCamera, Vector2, WebGLRenderer } from 'three';

interface IAxesScaffoldingOptions {
    object?: Object3D
    picker?: GPUPicker,
    scope: Scene
}

export type AxesScaffoldingOptions = (IAxesScaffoldingOptions | Scene);

export class AxesScaffolding {
    readonly axesHelper: ObjectAxesHelper;
    readonly picker: GPUPicker;
    private activeObject: Object3D;
    private readonly scope;
    constructor(config: AxesScaffoldingOptions) {
        if ('scope' in config) {
            const { scope } = config;
            const { camera, renderer, scene } = this.scope = scope;
            this.picker = config.picker ? config.picker : new GPUPicker(renderer as WebGLRenderer, scene, camera as PerspectiveCamera);
            this.axesHelper = new ObjectAxesHelper(this.picker);
            if (config.object) {
                this.activeObject = config.object.add(this.axesHelper);
            }
        }
        else {
            const scope = this.scope = config;
            const { camera, renderer, scene } = scope;
            this.picker = new GPUPicker(renderer as WebGLRenderer, scene, camera as PerspectiveCamera);
            this.axesHelper = new ObjectAxesHelper(this.picker);
        }

        const { axesHelper, scope } = this;
        const self = this;

        const rate = 3;
        window.addEventListener('mousedown', event => {
            const { activeObject } = self;
            const { intersects } = axesHelper;

            if (!activeObject) return;

            const { x: x0, y: y0 } = scope.mouse;
            let x1 = x0, y1 = y0;
            function translate() {
                let { x: x2, y: y2 } = scope.mouse;
                const u = Vectors.unit(intersects.axis);
                const v = u.applyEuler(activeObject.rotation);
                const d = rate * Vectors.distance(new Vector2(x1, y1), scope.mouse, new Vector2(v.x, v.y));
                activeObject.position.addScaledVector(v, d);
                x1 = x2;
                y1 = y2;
                document.body.style.cursor = 'grabbing';
                // document.body.style.cursor = 'url(img/cursors/grab.png), grabbing';
            }

            function rotate() {
                let { x: x2, y: y2 } = scope.mouse;
                const d = rate * Vectors.distance(new Vector2(x1, y1), scope.mouse)
                const u = Vectors.unit(intersects.axis);
                activeObject.rotateOnAxis(u, d * Math.PI);
                x1 = x2;
                y1 = y2;
                document.body.style.cursor = 'pointer';
                // document.body.style.cursor = 'url(img/cursors/rotate.png), pointer';
            }

            function scale() {
                let { x: x2, y: y2 } = scope.mouse;
                const d = rate * Vectors.distance(new Vector2(x1, y1), scope.mouse)
                activeObject.scale.addScalar(d);
                x1 = x2;
                y1 = y2;
                document.body.style.cursor = 'ne-resize';
                // document.body.style.cursor = 'url(img/cursors/scale.png), ne-resize';
            }

            function mouseUp() {
                axesHelper.disengage();
                window.removeEventListener('mouseup', mouseUp)
                window.removeEventListener('mousemove', mouseListener);
                document.body.style.cursor = axesHelper.intersects ? 'pointer' : 'auto';
                // document.body.style.cursor = axesHelper.intersects ? 'url(img/cursors/pointer.png), pointer' : 'url(img/cursors/default.png), auto';
            }
            const mouseListener = event => {
                if (intersects) {
                    axesHelper.engage();
                    const { ctrlKey, shiftKey } = event;
                    if (ctrlKey && shiftKey) {
                        scale();
                    }
                    else if (ctrlKey) {
                        rotate();
                    }
                    else {
                        translate();
                    }
                }
            }
            window.addEventListener('mousemove', mouseListener)
            window.addEventListener('mouseup', mouseUp);
        });
    }

    setObject(object: Object3D) {
        if (this.activeObject)
            this.activeObject.remove(this.axesHelper);
        if (object) object.add(this.axesHelper);
        this.activeObject = object;
    }
}