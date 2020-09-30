import * as THREE from 'three';
import { autoResize } from 'glaxier/behaviors';
import { Exposes } from 'glaxier/exposables';
import { ShaderPass, RGBShiftShader, DotScreenShader } from 'glaxier/externals';

export function render() {
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;

    const object = new THREE.Object3D();
    const geometry = new THREE.SphereBufferGeometry(1, 4, 4);
    const material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true });
    for (let i = 0; i < 100; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        mesh.position.multiplyScalar(Math.random() * 400);
        mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50;
        object.add(mesh);
    }

    const ambientLight = new THREE.AmbientLight(0x222222);

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);

    const effect1 = new ShaderPass(DotScreenShader);
    effect1.uniforms.scale.value = 4;

    const effect2 = new ShaderPass(RGBShiftShader);
    effect2.uniforms.amount.value = 0.0015;

    const dotScale = Exposes.prop(effect1.uniforms.scale);
    const rgbShiftAmount = Exposes.prop(effect2.uniforms.amount);

    return {
        camera,
        effects: [effect1, effect2],
        objects: [ambientLight, light, object],
        props: {
            dotScale, rgbShiftAmount
        },
        setup: function () {
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.scene.fog = new THREE.Fog( 0x000000, 1, 1000 );
            autoResize(this);
        },
        loop: function () {
            object.rotation.x += 0.005;
            object.rotation.y += 0.01;

            this.composer.render();
        },
        title: 'Postprocessing'
    }
}