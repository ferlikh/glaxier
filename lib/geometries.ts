import * as THREE from 'three';

export class Geometries {
    // box
    private static DEFAULT_WIDTH = 1;
    private static DEFAULT_HEIGHT = 1;
    private static DEFAULT_DEPTH = 1;
    private static DEFAULT_WIDTH_SEG_BOX = 1;
    private static DEFAULT_HEIGHT_SEG_BOX = 1;
    private static DEFAULT_DEPTH_SEG_BOX = 1;

    // sphere
    private static DEFAULT_RADIUS = 1;
    private static DEFAULT_WIDTH_SEG_SPH = 8;
    private static DEFAULT_HEIGHT_SEG_SPH = 6;
    private static DEFAULT_PHI_START = 0;
    private static DEFAULT_PHI_LEN = Math.PI * 2;
    private static DEFAULT_THETA_START = 0;
    private static DEFAULT_THETA_LEN = Math.PI;

    static box(
        width: number = this.DEFAULT_WIDTH, 
        height: number = this.DEFAULT_HEIGHT, 
        depth: number = this.DEFAULT_DEPTH,
        widthSegments: number = this.DEFAULT_WIDTH_SEG_BOX, 
        heightSegments: number = this.DEFAULT_HEIGHT_SEG_BOX, 
        depthSegments: number = this.DEFAULT_DEPTH_SEG_BOX
    ) { 
        return new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments); 
    }

    static buffer() {
        return new THREE.BufferGeometry();
    }

    static sphere(
        radius: number = this.DEFAULT_RADIUS,
        widthSegments: number = this.DEFAULT_WIDTH_SEG_SPH,
        heightSegments: number = this.DEFAULT_HEIGHT_SEG_SPH,
        phiStart: number = this.DEFAULT_PHI_START,
        phiLength: number = this.DEFAULT_PHI_LEN,
        thetaStart: number = this.DEFAULT_THETA_START,
        thetaLength: number = this.DEFAULT_THETA_LEN,
    ) {
        return new THREE.SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
    }

    static sphereBuffer(
        radius: number = this.DEFAULT_RADIUS,
        widthSegments: number = this.DEFAULT_WIDTH_SEG_SPH,
        heightSegments: number = this.DEFAULT_HEIGHT_SEG_SPH,
        phiStart: number = this.DEFAULT_PHI_START,
        phiLength: number = this.DEFAULT_PHI_LEN,
        thetaStart: number = this.DEFAULT_THETA_START,
        thetaLength: number = this.DEFAULT_THETA_LEN,
    ) {
        return new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
    }
}