import { autoExpose, autoResize, autoVRButton, Cameras, Geometries, Materials, Meshes } from 'glaxier';
import * as THREE from 'three';
let rotationSpeed = 1;
const DEFAULT_GREY = 0x9e9e9e;

export function render() {
    const camera = Cameras.perspective({
        fov: 75, 
        aspect: window.innerWidth / window.innerHeight, 
        near: 0.1, 
        far: 1000
    });
    const geometry = Geometries.sphere();
    const material = Materials.meshBasic({ color: 0x61c6a5 });
    const wireframe = new THREE.WireframeGeometry( geometry );
 
    const line = new THREE.LineSegments( wireframe, material );
    const sphere = Meshes.mesh(geometry, material);
    // line.material.depthTest = false;
    //line.material.opacity = 0.25;
    // line.material.transparent = false;

    return {
        camera, 
        objects: [ line ],
        setup: function() {
            console.log('sphere setup')
            this.camera.position.z = 5;
            autoResize(this);
            autoVRButton(this.renderer);
            autoExpose('color', sphere.material.color, sphere.material.color.getStyle);
            autoExpose('rotationSpeed', speed => rotationSpeed = speed, rotationSpeed);
        },
        loop: function() {
            line.rotation.x += 0.01 * rotationSpeed;
            line.rotation.y -= 0.01 * rotationSpeed;
            // sphere.rotation.x += 0.01;
            // sphere.rotation.y += 0.01;
            this.renderer.render(this.scene, this.camera);
        },
        title: 'Sphere'
    }
}
