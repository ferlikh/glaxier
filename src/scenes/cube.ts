import { autoExpose, autoResize, autoVRButton, Cameras, Geometries, Materials, Meshes, Tools } from 'glaxier';
let rotationSpeed = 1;
const DEFAULT_GREY = 0x9e9e9e;

export function render() {
    const camera = Cameras.perspective({
        fov:75, 
        aspect: window.innerWidth / window.innerHeight, 
        near: 0.1, 
        far: 1000
    });
    const geometry = Geometries.box();
    const material = Materials.meshBasic({ color: DEFAULT_GREY });
    const cube = Meshes.mesh(geometry, material);
    return {
        camera,
        objects: [ cube ],
        renderer: Tools.renderer(),
        setup: function() {
            console.log('cube setup');
            this.camera.position.z = 5;
            autoResize(this);
            autoVRButton(this.renderer);
            autoExpose('color', cube.material.color, cube.material.color.getStyle);
            autoExpose('rotationSpeed', speed => rotationSpeed = speed, rotationSpeed);
        },
        loop: function() {
            cube.rotation.x += 0.01 * rotationSpeed;
            cube.rotation.y += 0.01 * rotationSpeed;
            this.renderer.render(this.scene, this.camera);
        },
        title: 'Cube'
    }
}
