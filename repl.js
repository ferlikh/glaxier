const repl = require('repl');
const vm = require('vm');

repl.start({
    prompt: 'glxr>',
    input: process.stdin,
    output: process.stdout,
    // useGlobal: true,
    eval
    // eval: eval2
})

async function eval(cmd, context, filename, cb) {
    return await new Promise((resolve, reject) => {
        process.send(cmd, null, {}, err => {
            if (err) reject(err);
            process.once('message', msg => {
                let data = msg.err ? undefined : msg.data;
                if (msg.fn) {
                    data = parseFn(data, cmd.trim());
                }
                resolve(cb(null, data));
            });
        });
    });
}

function eval2(cmd, context, filename, callback) {
    let result;
    try {
        result = vm.runInThisContext(cmd);
    } catch (e) {
        if (isRecoverable(e)) {
            return callback(new repl.Recoverable(e));
        }
    }
    callback(null, result);
}

function isRecoverable(error) {
    if (error.name === 'SyntaxError') {
      return /^(Unexpected end of input|Unexpected token)/.test(error.message);
    }
    return false;
  }

function parseFn(data, alias) {
    // console.log(data);
    const name = data.replace(/(?:function)?\s*(.*?)\(.*\)\s*\{(?:.|\s)*\}$/, '$1') || alias;
    const args = data.replace(/(?:function)?\s*(?:.*?)\((.*?)\)\s*\{(?:.|\s)*\}$/, '$1').split(',').filter(a => a);
    const body = data.toString().replace(/(?:function)?\s*(?:.*?)?\((?:(?:.|\s)*?)\)\s*\{\s*((?:.|\s)*)\s*\}$/, '$1');
    // console.log({ name, args, body })
    if(body.includes('[native code]')) return vm.runInThisContext(name);
    const fn = new Function(...args, body);
    Object.defineProperty(fn, 'name', { value: name });
    return fn;
}

// process.on('message', function(m) {
//     console.log(`REPL recieved message ${m}`)
// })