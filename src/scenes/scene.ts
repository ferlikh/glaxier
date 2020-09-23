/*
*
*   Note: this file is just kept to reference for writing scripts w/ THREE vs glaxier
*
*/

// import * as THREE from 'three';
import { autoExpose, autoResize, autoVRButton, Cameras, Geometries, Materials, mesh, Scene } from 'glaxier';
export const DEFAULT_GREY = 0x9e9e9e;

// export function render() {
//     const
//         w = window.innerWidth,
//         h = window.innerHeight

//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);

    // const renderer = new THREE.WebGLRenderer();
    // renderer.setSize(w, h);
    // document.body.appendChild(renderer.domElement);

    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshBasicMaterial({ color: DEFAULT_GREY });
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);

    // camera.position.z = 5;
    // const animate = function () {
    //     requestAnimationFrame(animate);

    //     cube.rotation.x += 0.01;
    //     cube.rotation.y += 0.01;

    //     renderer.render(scene, camera);
    // };

    // animate();

    // const mask = 0x0000AA;
    // for XR
    // renderer.setAnimationLoop(function () {

    //     cube.rotation.x += 0.01;
    //     cube.rotation.y += 0.01;
    //     // cube.rotateOnWorldAxis(new THREE.Vector3(1, 0, 1), 0.01);

    //     // const hex = cube.material.color.getHex();
    //     // const color = colorMask(hex, mask) % 0x1000000;
    //     // const color = globalThis.color;
    //     // if(color !== hex) cube.material.color.set(color)
    //     renderer.render(scene, camera);

    // });

    // autoResize(renderer, camera);
    // autoVRButton(renderer);
    // autoExpose('color', cube.material.color, cube.material.color.getStyle);

    
// }

export function render() {
    const camera = Cameras.perspective({
        fov:75, 
        aspect: window.innerWidth / window.innerHeight, 
        near: 0.1, 
        far: 1000
    });
    const geometry = Geometries.box();
    const material = Materials.meshBasic({ color: DEFAULT_GREY });
    const cube = mesh(geometry, material);
    return new Scene({
        camera, 
        meshes:[ cube ],
        setup: function() {
            this.camera.position.z = 5;
            autoResize(this.renderer, this.camera);
            autoVRButton(this.renderer);
            autoExpose('color', cube.material.color, cube.material.color.getStyle);
            console.log('scene setup')
        },
        loop: function() {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            this.renderer.render(this.scene, this.camera);
        },
        // attached: true,
    })
}

// render();