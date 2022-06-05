import { autoExpose, autoGet, autoMouse, autoResize, autoVRButton, Cameras, compose, Geometries, Materials, Meshes, Scene } from 'glaxier';
import { Tools, ObjectAxesHelper, GPUPicker, Vectors, AxesScaffolding, Scaffolding } from 'glaxier/tools';
import { Animatable, AnimationGroup, ANIMATIONLOOPMODE, Animations, ANIMATIONTYPE, KeyFrames } from 'glaxier/animations';
import * as THREE from 'three';
import { Animation } from 'glaxier/animations/animation';
import { EasingFunction, Easings } from 'glaxier/animations/easing';
import { AxesHelper } from 'three';

let rotationSpeed = 0;
const DEFAULT_GREY = 0x9e9e9e;

export function render() {
    const camera = Cameras.perspective({
        fov: 75,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 1000
    });
    const geometry = Geometries.box();
    const material = Materials.meshBasic({ color: DEFAULT_GREY });
    const cubeA = Meshes.mesh(geometry, material);
    cubeA.position.set(-1, 0, 0);
    const cubeB = Meshes.mesh(geometry, material);
    cubeB.position.set(1, 0, 0);

    return {
        camera,
        renderer: Tools.renderer(),
        objects: [cubeA, cubeB],
        // controls: true,
        setup: function () {
            console.log('test setup');
            this.camera.position.z = 5;
            autoMouse(this);
            autoResize(this);
            // autoVRButton(this.renderer);
            autoExpose('color', cubeA.material.color, cubeA.material.color.getStyle);
            autoExpose('rotationSpeed', speed => rotationSpeed = speed, rotationSpeed);

            // cubeA.position.y = 2;
            
            const keys = KeyFrames.make([2, -2, 2], 30);

            const pos2Keys = [
                { frame: 0, value: { x:2, y:2 } },
                { frame: 30, value: { x:-2, y:-2 } },
                { frame: 60, value: { x:2, y:2 } }
            ];

            const pos3Keys = [
                { frame: 0, value: { x:2, y:2, z:2 } },
                { frame: 30, value: { x:-2, y:-2, z:0 } },
                { frame: 60, value: { x:2, y:2, z:2 } }
            ];
            
            const yPos = Animations.basic(cubeA, 'position.y', 30, ANIMATIONTYPE.FLOAT, ANIMATIONLOOPMODE.CYCLE, keys);
            const xPos = Animations.basic(cubeA, 'position.x', 30, ANIMATIONTYPE.FLOAT, ANIMATIONLOOPMODE.CYCLE, keys);
            const xyPos = Animations.basic(cubeA, 'position', 30, ANIMATIONTYPE.VECTOR2, ANIMATIONLOOPMODE.CYCLE, pos2Keys);
            const xyzPos = Animations.basic(cubeA, 'position', 30, ANIMATIONTYPE.VECTOR3, ANIMATIONLOOPMODE.CYCLE, pos3Keys);
            // xPos.setEasing(Easings.sine())
            // yPos.setEasing(Easings.sine())
            // xyPos.setEasing(Easings.circle())
            // yPos.setEasing(Easings.bounce(1, 0.02))
            const group = new AnimationGroup([xyPos, ]);
            group.play();

            // this.renderer = Tools.renderer();
            const { scaffolding, axesHelper, picker } = Scaffolding.axes(this, true);
            scaffolding.setObject(cubeA);
            // this.scene.add(cubeB);

            window.addEventListener('mousedown', ev => {
                if(axesHelper.isEngaged) return;
                const { clientX, clientY } = ev;
                const cube = picker.pick(clientX * window.devicePixelRatio, clientY * window.devicePixelRatio, object => object === cubeA || object === cubeB);
                scaffolding.setObject(cube);
            });
            
            autoGet({
                group, cubeA, cubeB
            })
        },
        loop: function () {
            const { axesHelper } = this //as { axesHelper: ObjectAxesHelper };
            // cube.rotation.x += 0.01 * rotationSpeed;
            cubeA.rotation.y += 0.01 * rotationSpeed;
            // gpuPicker.needsUpdate = true;
            const intersects = axesHelper.updateIntersections(this.mouse);
            // const { clientX, clientY } = this.mouse;
            // const pixelRatio = window.devicePixelRatio || 1.0;
            // const object = picker.pick(clientX * pixelRatio, clientY * pixelRatio, object => {
            //     switch (object.parent) {
            //         case axesHelper.arrowHelperAxes.x:
            //         case axesHelper.arrowHelperAxes.y:
            //         case axesHelper.arrowHelperAxes.z:
            //             return true;
            //     }
            //     return false;
            // });
            if (!axesHelper.isEngaged) {
                // if (object) {
                    // console.log(object);
                if (intersects) {
                    // console.log('INTERSECTED', intersects);
                    document.body.style.cursor = 'pointer';
                    // document.body.style.cursor = 'url(img/cursors/pointer.png), pointer';
                }
                else {
                    // console.log('UNSET');
                    document.body.style.cursor = 'auto';
                    // document.body.style.cursor = 'url(img/cursors/default.png), auto';
                }
            }

            this.renderer.render(this.scene, this.camera);
        },
        title: 'TEST'
    }
}