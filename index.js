const { spawn, fork } = require('child_process');

let repl;
const electron = spawn(require('electron'), ['./dist/main.js'], {
    cwd: __dirname,
    silent: true,
    stdio: ['inherit', 'inherit', 'inherit', 'ipc']
});
electron.on('close', (code, signal) => {
    if (code !== 0) {
        console.log(`electron process exited with code ${code} ${signal}`);
    }
});
electron.on('error', (err) => {
    console.error('Failed to start electron.', err);
});

electron.on('disconnect', () => {
    console.log('disconnect');
})

electron.on('exit', (code, signal) => {
    console.log(code, signal);
})

electron.once('message', msg => {
    if (msg === 'ready') runREPL();
});

function runREPL() {
    repl = fork('repl.js');

    repl.on('message', function (cmd) {
        cmd = cmd.replace(/\n$/, '');
        electron.send({ cmd });
        electron.once('message', msg => {
            repl.send(msg);
        });
    });
    repl.on('close', (code) => {
        if (code !== 0) {
            console.log(`repl process exited with code ${code}`);
        }
    });
    repl.on('error', (err) => {
        console.error('Failed to start repl.', err);
    });
    repl.on('exit', () => {
        electron.kill();
        process.exit();
    });
}