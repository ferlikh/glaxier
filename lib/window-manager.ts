import fs from 'fs';
import path from 'path';
import url from 'url';
import { BrowserWindow } from 'electron';
import { Utils } from './utils';

export class WindowManager {
    private static DEFAULT_WIDTH = 1024;
    private static DEFAULT_HEIGHT = 768;
    static windows: { [key: string]: BrowserWindow } = {};

    static open(config) {
        const isObject = typeof config === 'object';
        const name = isObject ? config.name : config;
        const win = new BrowserWindow({
            width: WindowManager.DEFAULT_WIDTH,
            height: WindowManager.DEFAULT_HEIGHT,
            webPreferences: {
                nodeIntegration: true,
                experimentalFeatures: true,
                webSecurity: false
            },
            frame: true,
        });

        WindowManager.registerWindow(win, name);
        Object.defineProperty(win, 'exec', {
            value: function exec(code) {
                return win.webContents.executeJavaScript(code);
            }
        });

        if (isObject && config.src) {
            const { src } = config;
            WindowManager.loadHTML(win, src);
        }

        // win.once('ready-to-show', () => {
        //     win.show()
        // });

        return win;
    }

    static load(scene, window) {
        if (typeof window === 'string') {
            window = WindowManager.windows[window];
        }

        return window ?
            WindowManager.loadWindow(window, Utils.stagingFile) :
            WindowManager.open({ name: scene, src: Utils.stagingFile });
    }

    static loadWindow(window: BrowserWindow, file: string) {
        return WindowManager.loadHTML(window, file);
    }

    private static loadHTML(window: BrowserWindow, file: string) {
        if (!path.extname(file)) file += '.html';

        // absolute path
        if (fs.existsSync(file)) {
            return WindowManager.loadURL(window, file);
        }
        // relative path
        else {
            const { relativePath } = Utils.lookup(file);
            if (relativePath) {
                return WindowManager.loadURL(window, relativePath);
            }
            else {
                console.error(`ERR: ${file} not found.`);
            }
        }
    }

    private static loadURL(window: BrowserWindow, pathname: string) {
        window.loadURL(url.format({
            pathname,
            protocol: 'file',
            slashes: true
        }));
        return window;
    }

    private static registerWindow(window: BrowserWindow, name: string | number) {
        if (name == null) {
            const noWindows = Object.values(this.windows).length;
            if (this.windows[noWindows]) {
                name = -1;
                while (!this.windows[++name]) { }
            }
            else {
                name = noWindows;
            }
        }
        else if (name in this.windows) {
            name += Object.keys(this.windows).filter(key => key.includes(name as string)).length.toString();
        }
        this.windows[name] = window;

        window.on('closed', () => delete this.windows[name]);
    }
}