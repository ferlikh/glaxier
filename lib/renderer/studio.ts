import { autoMouse, Scene } from "glaxier";
import { ObjectAxesHelper, Scaffolding, Styles } from "glaxier/tools";

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
        if(axesHelper.isEngaged) return;
        const { clientX, clientY } = ev;
        const x = clientX * window.devicePixelRatio, y = clientY * window.devicePixelRatio;
        const object = picker.pick(x, y, object => objects.includes(object)); // select only root level objects for now
        scaffolding.setObject(object);
    });
}
