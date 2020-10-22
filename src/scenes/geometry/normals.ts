import * as THREE from 'three';
import { Stats, GUI } from 'glaxier/renderer';
import { autoResize, Cameras, Materials, OrbitControls, Tools, VertexNormalsHelper } from 'glaxier';

const geometryList = [
    new THREE.BoxBufferGeometry(200, 200, 200, 2, 2, 2),
    new THREE.CircleBufferGeometry(200, 32),
    new THREE.CylinderBufferGeometry(75, 75, 200, 8, 8),
    new THREE.IcosahedronBufferGeometry(100, 1),
    new THREE.OctahedronBufferGeometry(200, 0),
    new THREE.PlaneBufferGeometry(200, 200, 4, 4),
    new THREE.RingBufferGeometry(32, 64, 16),
    new THREE.SphereBufferGeometry(100, 12, 12),
    new THREE.TorusBufferGeometry(64, 16, 12, 12),
    new THREE.TorusKnotBufferGeometry(64, 16)
];

const geometries = {
    BoxBufferGeometry: 0,
    CircleBufferGeometry: 1,
    CylinderBufferGeometry: 2,
    IcosahedronBufferGeometry: 3,
    OctahedronBufferGeometry: 4,
    PlaneBufferGeometry: 5,
    RingBufferGeometry: 6,
    SphereBufferGeometry: 7,
    TorusBufferGeometry: 8,
    TorusKnotBufferGeometry: 9
};

const options = {
    Geometry: 0
};

const material = Materials.meshBasic({ color: 0xfefefe, wireframe: true, opacity: 0.5 });
let mesh, geometry;

function addMesh(scene) {

    if (mesh !== undefined) {

        scene.remove(mesh);
        geometry.dispose();

    }

    geometry = geometryList[options.Geometry];

    // scale geometry to a uniform size

    geometry.computeBoundingSphere();

    var scaleFactor = 160 / geometry.boundingSphere.radius;
    geometry.scale(scaleFactor, scaleFactor, scaleFactor);

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    var vertexNormalsHelper = new VertexNormalsHelper(mesh, 10);
    mesh.add(vertexNormalsHelper);

}

export function render() {
    const stats = new Stats();
    const gui = new GUI({ width: 350 });
    return {
        camera: Cameras.perspective({
            fov: 70,
            near: 1,
            far: 1000,
            position: {
                z: 500
            }
        }),
        renderer: Tools.renderer({ antialias: true }),
        setup: function () {
            const { scene, camera, renderer } = this;
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableZoom = false;
            
            addMesh(scene);
            document.body.appendChild(stats.dom);
            gui.add(options, 'Geometry', geometries).onChange(function () {

                addMesh(scene);

            });
            autoResize(this);
        },
        loop: function () {
            this.renderer.render(this.scene, this.camera);
            stats.update();
        }
    }
}