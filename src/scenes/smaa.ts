import * as THREE from 'three';
import { Stats, SMAAPass } from 'glaxier/externals';
import { autoResize } from 'glaxier';

export function render() {
    const renderer = new THREE.WebGLRenderer();
    const stats = new Stats();

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 300;

    const geometry = new THREE.BoxBufferGeometry(120, 120, 120);
    const material1 = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });

    const mesh1 = new THREE.Mesh(geometry, material1);
    mesh1.position.x = - 100;

    const texture = new THREE.TextureLoader().load("textures/brick_diffuse.jpg");
    texture.anisotropy = 4;

    const material2 = new THREE.MeshBasicMaterial({ map: texture });

    const mesh2 = new THREE.Mesh(geometry, material2);
    mesh2.position.x = 100;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // postprocessing
    const smaaPass = new SMAAPass(window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio());

    return {
        camera,
        renderer,
        effects: [smaaPass],
        objects: [mesh1, mesh2],
        setup: function () {
            document.body.appendChild(stats.dom);
            autoResize(this);
        },
        loop: function () {
            const { scene, composer } = this;
            stats.begin();

            for (let i = 0; i < scene.children.length; i++) {

                const child = scene.children[i];

                child.rotation.x += 0.005;
                child.rotation.y += 0.01;

            }

            composer.render();
            stats.end();
        }
    }
}