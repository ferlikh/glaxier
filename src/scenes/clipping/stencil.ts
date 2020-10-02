import * as THREE from 'three';
import { autoResize, Cameras, Meshes, OrbitControls, Tools } from 'glaxier';
import { GUI, Stats } from 'glaxier/renderer';

const planes = [
    new THREE.Plane(new THREE.Vector3(- 1, 0, 0), 0),
    new THREE.Plane(new THREE.Vector3(0, - 1, 0), 0),
    new THREE.Plane(new THREE.Vector3(0, 0, - 1), 0)
];

const planeHelpers = planes.map(p => new THREE.PlaneHelper(p, 2, 0xffffff));
planeHelpers.forEach(ph => {
    ph.visible = false;
});

const planeParams = Tools.parameterize(
    {

        constant: 0,
        negated: false,
        displayHelper: false

    }
)(['planeX', 'planeY', 'planeZ']);

const params = {

    animate: true,
    ...planeParams

};

function configureSideMaterial(baseMat, plane) {
    return (side: THREE.Side, op: THREE.StencilOp) => {
        const mat = baseMat.clone();
        mat.side = side;
        mat.clippingPlanes = [plane];
        mat.stencilFail = op;
        mat.stencilZFail = op;
        mat.stencilZPass = op;
        return mat;
    }
}

function createPlaneStencilGroup(geometry, plane, renderOrder) {

    const group = new THREE.Group();
    const baseMat = new THREE.MeshBasicMaterial();
    baseMat.depthWrite = false;
    baseMat.depthTest = false;
    baseMat.colorWrite = false;
    baseMat.stencilWrite = true;
    baseMat.stencilFunc = THREE.AlwaysStencilFunc;

    const matConfigurator = configureSideMaterial(baseMat, plane);

    const mesh0 = Meshes.mesh(
        geometry,
        matConfigurator(THREE.BackSide, THREE.IncrementWrapStencilOp)
    )
    mesh0.renderOrder = renderOrder;
    group.add(mesh0);

    const mesh1 = Meshes.mesh(
        geometry,
        matConfigurator(THREE.FrontSide, THREE.DecrementWrapStencilOp)
    )
    mesh1.renderOrder = renderOrder;
    group.add(mesh1);

    return group;

}

function addParamFolder(gui) {
    return (folderName, index) => {
        const planeFolder = gui.addFolder(folderName);
        planeFolder.add(params[folderName], 'displayHelper').onChange(v => planeHelpers[index].visible = v);
        planeFolder.add(params[folderName], 'constant').min(- 1).max(1).onChange(d => planes[index].constant = d);
        planeFolder.add(params[folderName], 'negated').onChange(() => {

            planes[index].negate();
            params[folderName].constant = planes[index].constant;

        });
        planeFolder.open();
    }
}

export function render() {

    const clock = new THREE.Clock();
    const camera = Cameras.perspective({
        fov: 36,
        near: 1,
        far: 100
    })
    camera.position.set(2, 2, 2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7.5);
    dirLight.castShadow = true;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.left = - 2;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = - 2;

    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;

    const geometry = new THREE.TorusKnotBufferGeometry(0.4, 0.15, 220, 60);
    const object = new THREE.Group();

    // Set up clip plane rendering
    const
        planeObjects = [],
        planeGeom = new THREE.PlaneBufferGeometry(4, 4),
        poGroups = [];
    for (let i = 0; i < 3; i++) {

        const poGroup = new THREE.Group();
        const plane = planes[i];
        const stencilGroup = createPlaneStencilGroup(geometry, plane, i + 1);

        // plane is clipped by the other clipping planes
        const planeMat =
            new THREE.MeshStandardMaterial({

                color: 0xE91E63,
                metalness: 0.1,
                roughness: 0.75,
                clippingPlanes: planes.filter(p => p !== plane),

                stencilWrite: true,
                stencilRef: 0,
                stencilFunc: THREE.NotEqualStencilFunc,
                stencilFail: THREE.ReplaceStencilOp,
                stencilZFail: THREE.ReplaceStencilOp,
                stencilZPass: THREE.ReplaceStencilOp,

            });
        const po = Meshes.mesh(planeGeom, planeMat);
        po.onAfterRender = function (renderer) {

            renderer.clearStencil();

        };
        po.renderOrder = i + 1.1;

        object.add(stencilGroup);
        poGroup.add(po);
        planeObjects.push(po);
        poGroups.push(poGroup);

    }

    const material = new THREE.MeshStandardMaterial({

        color: 0xFFC107,
        metalness: 0.1,
        roughness: 0.75,
        clippingPlanes: planes,
        clipShadows: true,
        shadowSide: THREE.DoubleSide,

    });

    // add the color
    const clippedColorFront = new THREE.Mesh(geometry, material);
    clippedColorFront.castShadow = true;
    clippedColorFront.renderOrder = 6;
    object.add(clippedColorFront);


    const ground = Meshes.mesh(
        new THREE.PlaneBufferGeometry(9, 9, 1, 1),
        new THREE.ShadowMaterial({ color: 0, opacity: 0.25, side: THREE.DoubleSide })
    );

    ground.rotation.x = - Math.PI / 2; // rotates X/Y to X/Z
    ground.position.y = - 1;
    ground.receiveShadow = true;


    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x263238);

    renderer.localClippingEnabled = true;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 2;
    controls.maxDistance = 20;
    controls.update();

    // GUI
    const gui = new GUI();
    const makePlaneFolder = addParamFolder(gui);
    gui.add(params, 'animate');
    makePlaneFolder('planeX', 0);
    makePlaneFolder('planeY', 1);
    makePlaneFolder('planeZ', 2);

    const stats = new Stats();
    return {
        camera,
        controls,
        renderer,
        objects: [...planeHelpers, ambientLight, dirLight, object, ...poGroups, ground],
        setup: function () {
            // Stats

            document.body.appendChild(stats.dom);
            autoResize(this);
        },
        loop: function () {
            const delta = clock.getDelta();

            if (params.animate) {

                object.rotation.x += delta * 0.5;
                object.rotation.y += delta * 0.2;

            }

            for (let i = 0; i < planeObjects.length; i++) {

                const plane = planes[i];
                const po = planeObjects[i];
                plane.coplanarPoint(po.position);
                po.lookAt(
                    po.position.x - plane.normal.x,
                    po.position.y - plane.normal.y,
                    po.position.z - plane.normal.z,
                );

            }

            stats.begin();
            this.renderer.render(this.scene, camera);
            stats.end();

        }
    }
}