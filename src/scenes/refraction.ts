
import * as THREE from 'three';
import { autoResize, Cameras, Tools } from 'glaxier';
import { OrbitControls, Refractor, WaterRefractionShader } from 'glaxier/externals';
export function render() {

    // camera
    const camera = Cameras.perspective({
        fov: 45,
        near: 0.1,
        far: 200,
        position: {
            x: -10,
            y: 0,
            z: 15
        }
    });
    // camera.position.set(- 10, 0, 15);

    const renderer = Tools.renderer({ antialias: true });
    renderer.setClearColor(0x20252f);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 10;
    controls.maxDistance = 100;

    // clock
    const clock = new THREE.Clock();
    
    const geometry = new THREE.TorusKnotBufferGeometry(3, 1, 256, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x6083c2 });

    const mesh = new THREE.Mesh(geometry, material);

    // refractor
    const refractorGeometry = new THREE.PlaneBufferGeometry(10, 10);

    const refractor = new Refractor(refractorGeometry, {
        color: new THREE.Color(0x999999),
        textureWidth: 1024,
        textureHeight: 1024,
        shader: WaterRefractionShader
    });

    refractor.position.set(0, 0, 5);

    // load dudv map for distortion effect

    const dudvMap = new THREE.TextureLoader().load('textures/waterdudv.jpg');

    dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping;
    (<any>refractor.material).uniforms["tDudv"].value = dudvMap;
    
    // light

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    const pointLight = new THREE.PointLight(0xffffff, 0.8);

    return {
        camera,
        controls,
        objects: [mesh, refractor, ambientLight, pointLight, camera],
        renderer,
        setup: function() {
            autoResize(this);
            camera.lookAt(this.scene.position);
        },
        loop: function() {
            (<any>refractor.material).uniforms.time.value += clock.getDelta();
            renderer.render(this.scene, camera);
        }
    }


}