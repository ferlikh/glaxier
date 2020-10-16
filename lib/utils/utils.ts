import fs from 'fs';
import path from 'path';
import { BrowserWindow } from 'electron';

const Object3DOptionsMap = ['position', 'rotation'].reduce((dict, prop) => {
    dict[prop] = true;
    return dict;
}, {});

export class Utils {
    static readonly stagingFile = path.resolve('dist', 'stage.html');
    private static readonly defaultDirs = ['dist', 'dist/scenes'];
    private static readonly registeredDirs = [];

    static configure<T>(object: T, config) {
        if (config) {
            Object.entries(config).filter(([prop,]) => Object3DOptionsMap[prop]).forEach(([prop, options]) => {
                Object.assign(object[prop], options);
            });
        }
        return object;
    }

    static lookup(file) {
        const dirs = [...this.registeredDirs, ...this.defaultDirs];
        for (const dir of dirs) {
            const pathname = path.resolve(dir, file);
            if (fs.existsSync(pathname)) {
                const relativePath = './' + path.relative(path.resolve('dist'), pathname).replace(/\b\\\b/g, '/'); // for module type script tags
                const moduleImport = relativePath.replace(/\.js$/, ''); // for require
                const scriptSrc = relativePath.replace(/^\.\//, ''); // for non module script tags
                return { relativePath, moduleImport, scriptSrc };
            }
        }
        return {};
    }

    static propertyParent(object: any, propertyPath: string[]) {
        let target = object;
        const path = propertyPath.slice(0, -1);
        while(path.length) target = target[path.shift()];
        return target;
    }

    static stage(html) {
        fs.writeFileSync(this.stagingFile, html);
    }

    static registerPath(path) {
        this.registeredDirs.push(path);
    }

    static runInWindow(window: BrowserWindow | Promise<BrowserWindow>, code: string) {
        if(window instanceof Promise) 
            return window.then(window => Utils.runInWindow(window, code)); 
        return window.webContents.executeJavaScript(code).then(() => window);
    }

}

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