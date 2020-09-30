import * as THREE from 'three';
import { EffectComposer, CopyShader, ClearPass, ClearMaskPass, MaskPass, ShaderPass, TexturePass } from 'glaxier/externals';
import { autoResize } from 'glaxier';

export function render() {

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 10;

    const scene1 = new THREE.Scene();
    const scene2 = new THREE.Scene();

    const box = new THREE.Mesh(new THREE.BoxBufferGeometry(4, 4, 4));
    scene1.add(box);

    const torus = new THREE.Mesh(new THREE.TorusBufferGeometry(3, 1, 16, 32));
    scene2.add(torus);

    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xe0e0e0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;

    const clearPass = new ClearPass();
    const clearMaskPass = new ClearMaskPass();

    const maskPass1 = new MaskPass(scene1, camera);
    const maskPass2 = new MaskPass(scene2, camera);

    const texture1 = new THREE.TextureLoader().load('textures/758px-Canestra_di_frutta_(Caravaggio).jpg');
    texture1.minFilter = THREE.LinearFilter;
    const texture2 = new THREE.TextureLoader().load('textures/2294472375_24a3b8ef46_o.jpg');

    const texturePass1 = new TexturePass(texture1);
    const texturePass2 = new TexturePass(texture2);

    const outputPass = new ShaderPass(CopyShader);

    const parameters = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        stencilBuffer: true
    };

    const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, parameters);

    const composer = new EffectComposer(renderer, renderTarget);
    composer.addPass(clearPass);
    composer.addPass(maskPass1);
    composer.addPass(texturePass1);
    composer.addPass(clearMaskPass);
    composer.addPass(maskPass2);
    composer.addPass(texturePass2);
    composer.addPass(clearMaskPass);
    composer.addPass(outputPass);


    return {
        scenes: [scene1, scene2],
        composer,
        renderer,
        setup: function () {
            autoResize(this);
        },
        loop: function () {
            const time = performance.now() * 0.001 + 6000;

            box.position.x = Math.cos(time / 1.5) * 2;
            box.position.y = Math.sin(time) * 2;
            box.rotation.x = time;
            box.rotation.y = time / 2;

            torus.position.x = Math.cos(time) * 2;
            torus.position.y = Math.sin(time / 1.5) * 2;
            torus.rotation.x = time;
            torus.rotation.y = time / 2;

            renderer.clear();
            composer.render(time);
        },
        title: 'Mask(s)'
    }

}