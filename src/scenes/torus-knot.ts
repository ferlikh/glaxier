import * as THREE from 'three';
import { LuminosityShader, ShaderPass, SobelOperatorShader } from 'glaxier/externals';
import { autoResize } from 'glaxier';
import { Exposes } from 'glaxier/exposables';

export function render() {
    let _rotationSpeed = Math.PI / 64;
    const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 200 );
				

    const geometry = new THREE.TorusKnotBufferGeometry( 8, 3, 256, 32, 2, 3 );
    const material = new THREE.MeshPhongMaterial( { color: 0xffff00 } );
    const mesh = new THREE.Mesh( geometry, material );

    const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    const pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( pointLight );

    // color to grayscale conversion

    const effectGrayScale = new ShaderPass( LuminosityShader );
    // you might want to use a gaussian blur filter before
    // the next pass to improve the result of the Sobel operator

    // Sobel operator

    const effectSobel = new ShaderPass( SobelOperatorShader );
    effectSobel.uniforms.resolution.value.x = window.innerWidth * window.devicePixelRatio;
    effectSobel.uniforms.resolution.value.y = window.innerHeight * window.devicePixelRatio;


    const rotationSpeed = Exposes.prop(value => _rotationSpeed = value, () => _rotationSpeed);

    return {
        camera,
        effects: [effectGrayScale, effectSobel],
        objects: [mesh, ambientLight, camera],
        props: {
            rotationSpeed
        },
        setup: function () {
            this.renderer.setPixelRatio( window.devicePixelRatio );
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            camera.position.set( 0, 10, 25 );
            camera.lookAt( this.scene.position );
            
            autoResize(this);
        },
        loop: function () {
            const delta = 0.1 * _rotationSpeed;
            mesh.rotation.x -= delta;
            mesh.rotation.y += delta;
            this.composer.render();
        }
    }
}