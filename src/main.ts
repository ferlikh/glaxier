// import "core-js/stable";
// import "regenerator-runtime/runtime";
import fs from 'fs';
import vm from 'vm';
import path from 'path';
import { app, protocol } from 'electron';

import * as lib from 'glaxier';
import { ObjectParser, Utils, WindowManager } from 'glaxier';

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
// process.env['ELECTRON_RUN_AS_NODE'] = '0';

const distPath = path.resolve(__dirname, '../dist');

// <= v4.x
// protocol.registerStandardSchemes( [ 'dist' ] )

// >= v5.x
protocol.registerSchemesAsPrivileged([
    { scheme: 'dist', privileges: { standard: true } },
]);

app.on("ready", () => {
    // createWindow();

    // app.on("activate", function () {
    //     // On macOS it's common to re-create a window in the app when the
    //     // dock icon is clicked and there are no other windows open.
    //     // // if (BrowserWindow.getAllWindows().length === 0) createWindow();
    // });

    // for script tags 
    protocol.registerBufferProtocol('dist', (req, cb) => {
        fs.readFile(
            path.join(distPath, req.url.replace('dist://', '')),
            (e, data) => { cb({ mimeType: 'text/javascript', data }) }
        )
    });

    process.send('ready');
});


// Must subscribe to prevent app from disconnecting.
app.on('window-all-closed', (e) => {
    // if (process.platform !== "darwin") {
    //     app.quit();
    // }
    // console.log('window-all-closed', e)
});

const windowManager = new WindowManager;

Utils.registerPath('dist/html');

const context = {
    ...lib,
    window: lib.window(windowManager),
    render: lib.render(windowManager),
    compose: lib.compose(windowManager),
    $winman: windowManager,
};
const sandbox = vm.createContext(context);

process.on('message', msg => {
    // console.log(`ELECTRON recieved ${data}`);
    let data, fn;
    try {
        const { cmd } = msg;
        if (!cmd.trim().length) {
            process.send({ data });
        }
        else {
            data = vm.runInContext(cmd, sandbox);
            if (typeof data === 'function') { // workaround for
                // if(data instanceof Function) { // returns false for function expressions from inside vm contexts, i.e., (function x(){})
                data = data.toString();
                fn = true;
            }
            else if (data instanceof Promise) {
                data.then(value => {
                    process.send({ data: value });
                }, err => {
                    console.error(err);
                    process.send({ err });
                });
                return;
            }
            else if (data) {
                data = ObjectParser.parse(data);
            }
            // console.log(data);
            process.send({ data, fn });
        }
    }
    catch (err) {
        console.error(err);
        process.send({ err });
    }
});

// export {
//     app
// };