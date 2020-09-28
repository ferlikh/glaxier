import * as THREE from 'three';
import { HalftonePass } from 'glaxier/externals';
import { autoResize } from 'glaxier';
import { Exposes } from 'glaxier/exposables';

const mat = new THREE.ShaderMaterial({

    uniforms: {},

    vertexShader: [
        "varying vec2 vUV;",
        "varying vec3 vNormal;",

        "void main() {",

        "vUV = uv;",
        "vNormal = vec3( normal );",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

        "}"
    ].join("\n"),

    fragmentShader: [
        "varying vec2 vUV;",
        "varying vec3 vNormal;",

        "void main() {",

        "vec4 c = vec4( abs( vNormal ) + vec3( vUV, 0.0 ), 0.0 );",
        "gl_FragColor = c;",

        "}"
    ].join("\n")
});


export function render() {
    let rotationSpeed = Math.PI / 64;
    const clock = new THREE.Clock(),
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 ),
        group = new THREE.Group(),
        floor = new THREE.Mesh(new THREE.BoxBufferGeometry(100, 1, 100), new THREE.MeshPhongMaterial({})),
        light = new THREE.PointLight(0xffffff, 1.0, 50, 2);
    floor.position.y = - 10;
    light.position.y = 2;
    group.add(floor, light);

    for (let i = 0; i < 50; i++) {
        // fill scene with coloured cubes
        var mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(2, 2, 2), mat);
        mesh.position.set(Math.random() * 16 - 8, Math.random() * 16 - 8, Math.random() * 16 - 8);
        mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
        group.add(mesh);
    
    }

    const params = {
        shape: 1,
        radius: 4,
        rotateR: Math.PI / 12,
        rotateB: Math.PI / 12 * 2,
        rotateG: Math.PI / 12 * 3,
        scatter: 0,
        blending: 1,
        blendingMode: 1,
        greyscale: false,
        disable: false
    },
    halftonePass = new HalftonePass(window.innerWidth, window.innerHeight, params);


    const rotationSpeedProp = Exposes.prop(value => rotationSpeed = value, () => rotationSpeed);

    return {
        camera,
        effects: [halftonePass],
        objects: [group],
        props: {
            rotationSpeed: rotationSpeedProp
        },
        setup: function () {
            this.renderer.setPixelRatio( window.devicePixelRatio );
			this.renderer.setSize( window.innerWidth, window.innerHeight );
            this.scene.background = new THREE.Color(0x444444);
            this.camera.position.z = 12;
            
            autoResize(this);
        },
        loop: function () {
            const delta = clock.getDelta();
            group.rotation.y += delta * rotationSpeed;
            this.composer.render(delta);
        }
    }
}