import * as THREE from 'three';
import { GUI, Stats } from 'glaxier/renderer';
import { autoResize, Tools } from 'glaxier';

const segments = 10000;
const r = 800;
let t = 0;

const params = {
    morphTargets: false
};

export function render() {

    const camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.z = 2750;
    const clock = new THREE.Clock();
    
    const container = document.createElement('div');
    document.body.appendChild(container);

    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial( { vertexColors: true, morphTargets: true } );

    const positions = [];
    const colors = [];

    for ( let i = 0; i < segments; i ++ ) {

        const x = Math.random() * r - r / 2;
        const y = Math.random() * r - r / 2;
        const z = Math.random() * r - r / 2;

        // positions

        positions.push( x, y, z );

        // colors

        colors.push( ( x / r ) + 0.5 );
        colors.push( ( y / r ) + 0.5 );
        colors.push( ( z / r ) + 0.5 );

    }

    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    generateMorphTargets( geometry );

    geometry.computeBoundingSphere();

    const line = new THREE.Line( geometry, material );

    const gui = new GUI();
    gui.add( params, 'morphTargets' );
    gui.open();

    const renderer = Tools.renderer();
    renderer.outputEncoding = THREE.sRGBEncoding;
    const stats = new Stats();
    container.appendChild( stats.dom );


    return {
        objects: [line],
        renderer,
        setup: function() {
            autoResize(this);
        },
        loop: function() {
            const delta = clock.getDelta();
            const time = clock.getElapsedTime();

            line.rotation.x = time * 0.25;
            line.rotation.y = time * 0.5;

            if ( params.morphTargets ) {

                t += delta * 0.5;
                line.morphTargetInfluences[ 0 ] = Math.abs( Math.sin( t ) );

            }

            renderer.render( this.scene, camera );
            stats.update();
        }
    }

}

function generateMorphTargets( geometry ) {

    const data = [];

    for ( let i = 0; i < segments; i ++ ) {

        const x = Math.random() * r - r / 2;
        const y = Math.random() * r - r / 2;
        const z = Math.random() * r - r / 2;

        data.push( x, y, z );

    }

    const morphTarget = new THREE.Float32BufferAttribute( data, 3 );
    morphTarget.name = 'target1';

    geometry.morphAttributes.position = [ morphTarget ];

}
