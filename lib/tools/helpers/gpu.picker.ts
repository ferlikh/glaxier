/**
 * Adapted from: https://github.com/bzztbomb/three_js_gpu_picking
 */

import * as THREE from 'three'

export class GPUPicker {
    // This is the 1x1 pixel render target we use to do the picking
    pickingTarget = new THREE.WebGLRenderTarget(1, 1, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        encoding: THREE.LinearEncoding
    });
    // We need to be inside of .render in order to call renderBufferDirect in renderList() so create an empty scene
    // and use the onAfterRender callback to actually render geometry for picking.
    emptyScene = new THREE.Scene();
    // RGBA is 4 channels.
    pixelBuffer = new Uint8Array(4 * this.pickingTarget.width * this.pickingTarget.height);
    clearColor = new THREE.Color(0xffffff);
    materialCache = [];
    pickFilter = undefined;

    constructor(private renderer: THREE.WebGLRenderer, private scene: THREE.Scene, private camera: THREE.PerspectiveCamera) {
        this.emptyScene.onAfterRender = this.renderList.bind(this);
    }

    pick(x, y, filterFn?) {
        this.pickFilter = filterFn;
        const { renderer, camera, pickingTarget, clearColor, emptyScene, pixelBuffer } = this;
        const w = renderer.domElement.width;
        const h = renderer.domElement.height;
        // Set the projection matrix to only look at the pixel we are interested in.
        camera.setViewOffset(w, h, x, y, 1, 1);

        const currRenderTarget = renderer.getRenderTarget();
        const currClearColor = renderer.getClearColor();
        renderer.setRenderTarget(pickingTarget);
        // renderer.setClearColor(clearColor);
        // renderer.clear();
        renderer.render(emptyScene, camera);
        renderer.readRenderTargetPixels(pickingTarget, 0, 0, pickingTarget.width, pickingTarget.height, pixelBuffer);
        renderer.setRenderTarget(currRenderTarget);
        renderer.setClearColor(currClearColor);
        camera.clearViewOffset();

        const id = (pixelBuffer[0] << 24) + (pixelBuffer[1] << 16) + (pixelBuffer[2] << 8) + pixelBuffer[3];
        return id > -1? this.scene.getObjectById(id): null;
    }

    private renderList() {
        // This is the magic, these render lists are still filled with valid data.  So we can
        // submit them again for picking and save lots of work!
        const { renderer, scene, camera } = this;
        const renderList = renderer.renderLists.get(scene, camera);
        renderList.opaque.forEach(item => this.processItem(item));
        renderList.transparent.forEach(item => this.processItem(item));
    }

    private processItem(renderItem) {
        const { renderer, camera, materialCache } = this;
        const object = renderItem.object;
        if (this.pickFilter && !this.pickFilter(object)) {
            return;
        }
        const objId = object.id;
        const material = renderItem.material;
        const geometry = renderItem.geometry;

        let useMorphing = 0;

        if (material.morphTargets === true) {
            if (geometry.isBufferGeometry === true) {
                useMorphing =
                    geometry.morphAttributes && geometry.morphAttributes.position && geometry.morphAttributes.position.length > 0
                        ? 1
                        : 0;
            } else if (geometry.isGeometry === true) {
                useMorphing = geometry.morphTargets && geometry.morphTargets.length > 0 ? 1 : 0;
            }
        }

        let useSkinning = 0;
        if (object.isSkinnedMesh === true) {
            if (material.skinning === true) {
                useSkinning = 1;
            } else {
                console.warn('THREE.SkinnedMesh with material.skinning set to false:', object);
            }
        }

        const useInstancing = object.isInstancedMesh === true ? 1 : 0;
        const frontSide = material.side === THREE.FrontSide ? 1 : 0;
        const backSide = material.side === THREE.BackSide ? 1 : 0;
        const doubleSide = material.side === THREE.DoubleSide ? 1 : 0;
        const index =
            (useMorphing << 0) |
            (useSkinning << 1) |
            (useInstancing << 2) |
            (frontSide << 3) |
            (backSide << 4) |
            (doubleSide << 5);
        let renderMaterial = renderItem.object.pickingMaterial ? renderItem.object.pickingMaterial : materialCache[index];
        if (!renderMaterial) {
            renderMaterial = new THREE.ShaderMaterial({
                skinning: useSkinning > 0,
                morphTargets: useMorphing > 0,
                vertexShader: THREE.ShaderChunk.meshbasic_vert,
                fragmentShader: `
          uniform vec4 objectId;
          void main() {
            gl_FragColor = objectId;
          }
        `,
                side: material.side,
            });
            renderMaterial.uniforms = {
                objectId: { value: [1.0, 1.0, 1.0, 1.0] },
            };
            materialCache[index] = renderMaterial;
        }
        renderMaterial.uniforms.objectId.value = [
            (objId >> 24 & 255) / 255,
            (objId >> 16 & 255) / 255,
            (objId >> 8 & 255) / 255,
            (objId & 255) / 255,
        ];
        renderMaterial.uniformsNeedUpdate = true;
        renderer.renderBufferDirect(camera, null, geometry, renderMaterial, object, null);
    }
}