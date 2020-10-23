import * as THREE from 'three';
import { FirstPersonControls, ImprovedNoise, BufferGeometryUtils } from 'glaxier/externals';
import { Stats } from 'glaxier/renderer';
import { autoResize, Tools } from 'glaxier';

const worldWidth = 128, worldDepth = 128;
const worldHalfWidth = worldWidth / 2;
const worldHalfDepth = worldDepth / 2;
const data = generateHeight(worldWidth, worldDepth);

const clock = new THREE.Clock();

function setArrayByIndex<T>(array: ArrayLike<T>, value: T, indices: number[]) {
    indices.forEach(index => (array as Array<T>)[index] = value);
}

function generateHeight(width, height) {

    var data = [], perlin = new ImprovedNoise(),
        size = width * height, quality = 2, z = Math.random() * 100;

    for (var j = 0; j < 4; j++) {

        if (j === 0) for (var i = 0; i < size; i++) data[i] = 0;

        for (var i = 0; i < size; i++) {

            var x = i % width, y = (i / width) | 0;
            data[i] += perlin.noise(x / quality, y / quality, z) * quality;

        }

        quality *= 4;

    }

    return data;
}

function getY(x, z) {

    return (data[x + z * worldWidth] * 0.2) | 0;

}

function generateGeometries() {
    // sides
    const matrix = new THREE.Matrix4();

    const pxGeometry = new THREE.PlaneBufferGeometry(100, 100);
    setArrayByIndex(pxGeometry.attributes.uv.array, 0.5, [1, 3]);
    pxGeometry.rotateY(Math.PI / 2);
    pxGeometry.translate(50, 0, 0);

    const nxGeometry = new THREE.PlaneBufferGeometry(100, 100);
    setArrayByIndex(nxGeometry.attributes.uv.array, 0.5, [1, 3]);
    nxGeometry.rotateY(- Math.PI / 2);
    nxGeometry.translate(- 50, 0, 0);

    const pyGeometry = new THREE.PlaneBufferGeometry(100, 100);
    setArrayByIndex(pyGeometry.attributes.uv.array, 0.5, [5, 7]);
    pyGeometry.rotateX(- Math.PI / 2);
    pyGeometry.translate(0, 50, 0);

    const pzGeometry = new THREE.PlaneBufferGeometry(100, 100);
    setArrayByIndex(pzGeometry.attributes.uv.array, 0.5, [1, 3]);
    pzGeometry.translate(0, 0, 50);

    const nzGeometry = new THREE.PlaneBufferGeometry(100, 100);
    setArrayByIndex(nzGeometry.attributes.uv.array, 0.5, [1, 3]);
    nzGeometry.rotateY(Math.PI);
    nzGeometry.translate(0, 0, - 50);

    //

    const geometries = [];

    for (let z = 0; z < worldDepth; z++) {

        for (let x = 0; x < worldWidth; x++) {

            const h = getY(x, z);

            matrix.makeTranslation(
                x * 100 - worldHalfWidth * 100,
                h * 100,
                z * 100 - worldHalfDepth * 100
            );

            const px = getY(x + 1, z);
            const nx = getY(x - 1, z);
            const pz = getY(x, z + 1);
            const nz = getY(x, z - 1);

            geometries.push(pyGeometry.clone().applyMatrix4(matrix));

            if ((px !== h && px !== h + 1) || x === 0) {

                geometries.push(pxGeometry.clone().applyMatrix4(matrix));

            }

            if ((nx !== h && nx !== h + 1) || x === worldWidth - 1) {

                geometries.push(nxGeometry.clone().applyMatrix4(matrix));

            }

            if ((pz !== h && pz !== h + 1) || z === worldDepth - 1) {

                geometries.push(pzGeometry.clone().applyMatrix4(matrix));

            }

            if ((nz !== h && nz !== h + 1) || z === 0) {

                geometries.push(nzGeometry.clone().applyMatrix4(matrix));

            }

        }

    }

    return geometries;
}

export function render() {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.y = getY(worldHalfWidth, worldHalfDepth) * 100 + 100;

    const renderer = Tools.renderer({ antialias: true });
    const controls = new FirstPersonControls(camera, renderer.domElement);

    controls.movementSpeed = 1000;
    controls.lookSpeed = 0.125;
    controls.lookVertical = true;

    const stats = new Stats();
    container.appendChild(stats.dom);

    const geometry = BufferGeometryUtils.mergeBufferGeometries(generateGeometries());
    geometry.computeBoundingSphere();

    const texture = new THREE.TextureLoader().load('textures/minecraft/atlas.png');
    texture.magFilter = THREE.NearestFilter;

    const mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide }));

    // lights
    const ambientLight = new THREE.AmbientLight(0xcccccc);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 0.5).normalize();

    return {
        camera,
        container,
        controls,
        objects: [mesh, ambientLight, directionalLight],
        renderer,
        setup: function () {
            this.scene.background = new THREE.Color( 0xbfd1e5 );
            autoResize(this, aspect => {
                camera.aspect = aspect;
                camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                controls.handleResize();
            });
        },
        loop: function () {
            controls.update(clock.getDelta());
            this.renderer.render(this.scene, camera);
            stats.update();
        }
    }
}