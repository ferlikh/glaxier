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

// look for scenes in this path
Utils.registerPath('dist/html');

const logProxy = new Proxy(console.log, {
    apply(target, thisArg, params) {
        process.send({ log: true, params })
    }
});

const context = {
    ...lib,
    console: new Proxy(console, {
        get(target, prop) {
            switch(prop) {
                case 'log': return logProxy;
                default: return target[prop]
            }
        }
    }),
    $winman: Object.defineProperties({}, {
        windows: {
            enumerable: true,
            get: () => WindowManager.windows
        },
        open: {
            get: () => WindowManager.open
        }
    }),
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
                    process.send({ data: ObjectParser.parse(value) });
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