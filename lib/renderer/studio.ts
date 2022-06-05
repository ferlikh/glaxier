import { autoGet, autoMouse, Scene } from "glaxier";
import { ObjectAxesHelper, Scaffolding, Styles } from "glaxier/tools";
import { WebGLRenderer } from "three";
import { Capturer } from "./tools/capture";

const MediaRecorder = window['MediaRecorder'];
var capturer: Capturer;
let firstFrame = true;

export function loop(loop) {
    const { axesHelper } = this as { axesHelper: ObjectAxesHelper };
    const intersects = axesHelper.updateIntersections(this.mouse);
    if (!axesHelper.isEngaged) {
        if (intersects) {
            Styles.setCursor('pointer');
        }
        else {
            Styles.setCursor('auto');
        }
    }
    loop.call(this);

    if(capturer.capturing || firstFrame) {
        capturer.addFrame();
        firstFrame = false;
    }
}

export function setup(setup) {
    setup.call(this);
    // mouse coordinates
    if (!this.hasOwnProperty('mouse'))
        autoMouse(this);
    // setup scaffolding
    const { objects } = this as Scene;
    const { axesHelper, picker, scaffolding } = Scaffolding.axes(this, true);
    window.addEventListener('mousedown', ev => {
        if (axesHelper.isEngaged) return;
        const { clientX, clientY } = ev;
        const x = clientX * window.devicePixelRatio, y = clientY * window.devicePixelRatio;
        const object = picker.pick(x, y, object => objects.includes(object)); // select only root level objects for now
        scaffolding.setObject(object);
    });

    const renderer = this.renderer as WebGLRenderer;
    // Optional frames per second argument.
    const stream = (<any>renderer.domElement).captureStream(30);

    const options = { mimeType: 'video/webm;codecs=vp9' };
    const recorder = new MediaRecorder(stream, options);

    recorder.ondataavailable = handleDataAvailable;

    const gl = renderer.getContext() as WebGL2RenderingContext;

    capturer = new Capturer(gl);

    setTimeout(function() {
        capturer.finish();
    }, 3000)

    autoGet({ recorder, capturer });
}

function handleDataAvailable(event) {
    if (event.data.size > 0) {
        download(event.data);
    } else {
        throw new Error('no data available');
    }
}
function download(blob) {
    const title = document.title ? document.title : 'scene';
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = title + '.webm';
    a.click();
    window.URL.revokeObjectURL(url);
}