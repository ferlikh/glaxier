import * as THREE from 'three';
import { FirstPersonControls } from 'glaxier/externals';
import { Stats } from 'glaxier/renderer';
import { autoResize, Tools } from 'glaxier';
import { BufferAttribute } from 'three';
const worldWidth = 128, worldDepth = 128;

export function render() {

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.y = 200;

    const clock = new THREE.Clock();

    const geometry = new THREE.PlaneBufferGeometry(20000, 20000, worldWidth - 1, worldDepth - 1);
    geometry.rotateX(- Math.PI / 2);

    const position = geometry.attributes.position as BufferAttribute;
    position.usage = THREE.DynamicDrawUsage;

    for (let i = 0; i < position.count; i++) {
        const y = 35 * Math.sin(i / 2);
        position.setY(i, y);
    }

    const texture = new THREE.TextureLoader().load('textures/water.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 5);

    const material = new THREE.MeshBasicMaterial({ color: 0x0044ff, map: texture });

    const stats = new Stats();
    document.body.appendChild(stats.dom);

    const renderer = Tools.renderer({ antialias: true });

    const controls = new FirstPersonControls(camera, renderer.domElement);

    controls.movementSpeed = 500;
    controls.lookSpeed = 0.1;

    const mesh = new THREE.Mesh(geometry, material);

    return {
        camera,
        controls,
        objects: [mesh],
        renderer,
        setup: function() {
            const { scene } = this;
            scene.background = new THREE.Color(0xaaccff);
            scene.fog = new THREE.FogExp2(0xaaccff, 0.0007);
            autoResize(this, aspect => {

                camera.aspect = aspect;
                camera.updateProjectionMatrix();

                renderer.setSize(window.innerWidth, window.innerHeight);

            })
        },
        loop: function () {
            const { scene } = this;
            const delta = clock.getDelta();
            const time = clock.getElapsedTime() * 10;

            const position = geometry.attributes.position;

            for (let i = 0; i < position.count; i++) {
                const y = 35 * Math.sin(i / 5 + (time + i) / 7);
                position.setY(i, y);
            }

            position.needsUpdate = true;

            controls.update(delta);
            renderer.render(scene, camera);
            stats.update();
        }
    }
}
