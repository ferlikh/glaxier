import * as THREE from 'three';
import { GUI } from 'glaxier/renderer';
import { autoResize, Cameras, OrbitControls } from 'glaxier';

const params = {
    clipIntersection: true,
    planeConstant: 0,
    showHelpers: false
};

const clipPlanes = [
    new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
    new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
    new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)
];

export function render() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.localClippingEnabled = true;

    const camera = Cameras.perspective({
        fov: 40,
        near: 1,
        far: 200,
        position: {
            x: -1.5,
            y: 2.5,
            z: 3.0
        }
    });

    const light = new THREE.HemisphereLight(0xffffff, 0x080808, 1.5);
    light.position.set(-1.25, 1, 1.25);

    const group = new THREE.Group();

    for (let i = 1; i <= 30; i += 2) {

        const geometry = new THREE.SphereBufferGeometry(i / 30, 48, 24);

        const material = new THREE.MeshLambertMaterial({

            color: new THREE.Color().setHSL(Math.random(), 0.5, 0.5),
            side: THREE.DoubleSide,
            clippingPlanes: clipPlanes,
            clipIntersection: params.clipIntersection

        });

        group.add(new THREE.Mesh(geometry, material));

    }

    const helpers = new THREE.Group();
    helpers.add(new THREE.PlaneHelper(clipPlanes[0], 2, 0xff0000));
    helpers.add(new THREE.PlaneHelper(clipPlanes[1], 2, 0x00ff00));
    helpers.add(new THREE.PlaneHelper(clipPlanes[2], 2, 0x0000ff));
    helpers.visible = false;

    // gui

    const gui = new GUI();

    gui.add(params, 'clipIntersection').name('clip intersection').onChange(function (value) {

        const { children } = group;//THREE.Mesh<THREE.Geometry, THREE.Material>[];

        for (let i = 0; i < children.length; i++) {

            children[i]['material'].clipIntersection = value;

        }
    });

    gui.add(params, 'planeConstant', -1, 1).step(0.01).name('plane constant').onChange(function (value) {

        for (let j = 0; j < clipPlanes.length; j++) {

            clipPlanes[j].constant = value;

        }
    });

    gui.add(params, 'showHelpers').name('show helpers').onChange(function (value) {

        helpers.visible = value;

    });

    return {
        camera,
        renderer,
        objects: [light, group, helpers],
        setup: function () {
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.minDistance = 1;
            controls.maxDistance = 10;
            controls.enablePan = false;
            autoResize(this);
        },
        loop: function () {
            this.renderer.render(this.scene, camera);
        },
        title: 'Clipping - Intersection'
    }
}


