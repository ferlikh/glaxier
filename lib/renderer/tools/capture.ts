import { Utils } from "glaxier/utils";

const { GIF } = require('../../../assets/js/gif');

// seems to work well w/ gif.js
const DELAY = 20;

export class Capturer {
    private gif = new GIF({ workers: 4 });
    private _capturing = false;
    private buffer: Uint8Array;
    private width: number;
    private height: number;
    private size: number;

    get capturing() {
        return this._capturing;
    }
    constructor(private gl: WebGL2RenderingContext) { }

    addFrame() {
        // if we aren't capturing already, start
        if(!this._capturing) {
            this._capturing = true;
            this.width = this.gl.drawingBufferWidth;
            this.height = this.gl.drawingBufferHeight;
            this.size = this.width * this.height * 4;
            this.buffer = new Uint8Array(this.size);
        }
        const { buffer, gif, gl } = this;
        gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
        const imageData = new ImageData(new Uint8ClampedArray(buffer), gl.drawingBufferWidth, gl.drawingBufferHeight);
        gif.addFrame(imageData, { delay: DELAY });
    }

    finish() {
        this.gif.on('finished', blob => {
            Utils.download(blob, '.gif');
        });
        this.gif.render();
        this._capturing = false;
    }
}