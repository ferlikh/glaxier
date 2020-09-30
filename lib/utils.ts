import fs from 'fs';
import path from 'path';

export interface Settable {
    set(value: any);
}

export interface Valuable {
    value: any;
}

export interface Vector3Options {
    x?: number;
    y?: number;
    z?: number;
}

export interface Object3DOptions {
    position?: Vector3Options;
    rotation?: Vector3Options;
}

export class Utils {
    static readonly stagingFile = path.resolve(__dirname, '..', 'dist', 'stage.html');
    private static readonly defaultDirs = ['dist', 'dist/scenes'];
    private static readonly registeredDirs = [];

    static configure(object, config) {
        if (config) {
            Object.entries(config).forEach(([prop, options]) => {
                Object.assign(object[prop], options);
            });
        }
        return object;
    }

    static stage(html) {
        fs.writeFileSync(this.stagingFile, html);
    }

    static registerPath(path) {
        this.registeredDirs.push(path);
    }

    static lookup(file) {
        const dirs = [...this.registeredDirs, ...this.defaultDirs];
        for (const dir of dirs) {
            const pathname = path.resolve(dir, file);
            if (fs.existsSync(pathname)) {
                const relativePath = './' + path.relative(path.resolve(__dirname, '../dist'), pathname).replace(/\b\\\b/g, '/'); // for module type script tags
                const moduleImport = relativePath.replace(/\.js$/, ''); // for require
                const scriptSrc = relativePath.replace(/^\.\//, ''); // for non module script tags
                return { relativePath, moduleImport, scriptSrc };
            }
        }
        return {};
    }

    static stageTemplate(transform, scriptSrc) {
        return htmlTemplate(scriptSrc, `$scene = ${transform}(render()).attach();`)
    }

}

const htmlTemplate = (scriptSrc, code) => `
<html>
    <head>
        <title>Rendered Scene</title>
        <style>
            body { margin: 0; }
            canvas { display: block; }
        </style>
    </head>
    <body>
        <script src="dist://vendors.js"></script>
        <script src="dist://renderer-lib.js"></script>
        <script src="dist://${scriptSrc}"></script>
        <script>
            ${code}
        </script>
    </body>
</html>`

export class ObjectParser {
    static parse(value) {
        return JSON.parse(JSON.stringify(value, ObjectParser.stringifyReplacer(value)));
    }

    private static stringifyReplacer(toBeStringified: any): any {
        const refMap = new Map<any, number>();
        let serializedObjectCounter = 0;
        return function (key: any, value: any) {
            if (serializedObjectCounter !== 0 && typeof (toBeStringified) === 'object' && toBeStringified === value) {
                // console.error(`object serialization with key ${key} has circular reference to being stringified object`);
                return Symbol(key);
            }

            serializedObjectCounter++;

            const isObject = typeof (value) === 'object'

            if (refMap.has(value)) {
                return ObjectParser.parse(value);
            }
            else if (isObject) {
                refMap.set(value, serializedObjectCounter);
            }
            return value;
        }
    }
}