import { autoResize } from 'glaxier';
import * as THREE from 'three';

export function render() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    let aspect = window.innerWidth / window.innerHeight, frustumSize = 600;

    const camera = new THREE.PerspectiveCamera(50, 0.5 * aspect, 1, 10000);
    camera.position.z = 2500;

    const cameraPerspective = new THREE.PerspectiveCamera(50, 0.5 * aspect, 150, 1000);
    const cameraPerspectiveHelper = new THREE.CameraHelper(cameraPerspective);

    const cameraOrtho = new THREE.OrthographicCamera(0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 150, 1000);
    const cameraOrthoHelper = new THREE.CameraHelper(cameraOrtho);

    let activeCamera, activeHelper;
    activeCamera = cameraPerspective;
    activeHelper = cameraPerspectiveHelper;

    // counteract different front orientation of cameras vs rig

    cameraOrtho.rotation.y = Math.PI;
    cameraPerspective.rotation.y = Math.PI;

    const cameraRig = new THREE.Group();

    cameraRig.add(cameraPerspective);
    cameraRig.add(cameraOrtho);

    const mesh = new THREE.Mesh(
        new THREE.SphereBufferGeometry(100, 16, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
    );

    const mesh2 = new THREE.Mesh(
        new THREE.SphereBufferGeometry(50, 16, 8),
        new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    );
    mesh2.position.y = 150;
    mesh.add(mesh2);

    var mesh3 = new THREE.Mesh(
        new THREE.SphereBufferGeometry(5, 16, 8),
        new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true })
    );
    mesh3.position.z = 150;
    cameraRig.add(mesh3);

    const geometry = new THREE.BufferGeometry(),
        vertices = [];

    for (let i = 0; i < 10000; i++) {

        vertices.push(THREE.MathUtils.randFloatSpread(2000)); // x
        vertices.push(THREE.MathUtils.randFloatSpread(2000)); // y
        vertices.push(THREE.MathUtils.randFloatSpread(2000)); // z

    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x888888 }));

    const renderer = new THREE.WebGLRenderer({ antialias: true });

    return {
        container,
        objects: [cameraPerspectiveHelper, cameraOrthoHelper, cameraRig, mesh, particles],
        renderer,
        setup: function () {
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.autoClear = false;

            autoResize(this, aspect => {
                renderer.setSize(window.innerWidth, window.innerHeight);
        
                camera.aspect = 0.5 * aspect;
                camera.updateProjectionMatrix();
        
                cameraPerspective.aspect = 0.5 * aspect;
                cameraPerspective.updateProjectionMatrix();
        
                cameraOrtho.left = - 0.5 * frustumSize * aspect / 2;
                cameraOrtho.right = 0.5 * frustumSize * aspect / 2;
                cameraOrtho.top = frustumSize / 2;
                cameraOrtho.bottom = - frustumSize / 2;
                cameraOrtho.updateProjectionMatrix();
            });
        },
        loop: function () {
            var r = Date.now() * 0.0005;

            mesh.position.x = 700 * Math.cos(r);
            mesh.position.z = 700 * Math.sin(r);
            mesh.position.y = 700 * Math.sin(r);

            mesh.children[0].position.x = 70 * Math.cos(2 * r);
            mesh.children[0].position.z = 70 * Math.sin(r);

            if (activeCamera === cameraPerspective) {

                cameraPerspective.fov = 35 + 30 * Math.sin(0.5 * r);
                cameraPerspective.far = mesh.position.length();
                cameraPerspective.updateProjectionMatrix();

                cameraPerspectiveHelper.update();
                cameraPerspectiveHelper.visible = true;

                cameraOrthoHelper.visible = false;

            } else {

                cameraOrtho.far = mesh.position.length();
                cameraOrtho.updateProjectionMatrix();

                cameraOrthoHelper.update();
                cameraOrthoHelper.visible = true;

                cameraPerspectiveHelper.visible = false;

            }

            cameraRig.lookAt(mesh.position);

            renderer.clear();

            activeHelper.visible = false;

            renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight);
            renderer.render(this.scene, activeCamera);

            activeHelper.visible = true;

            renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
            renderer.render(this.scene, camera);
        }
    }

}