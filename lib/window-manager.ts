import fs from 'fs';
import path from 'path';
import url from 'url';
import { BrowserWindow } from 'electron';
import { Utils } from './utils';

export class WindowManager {
    private DEFAULT_WIDTH = 1024;
    private DEFAULT_HEIGHT = 768;
    windows: { [key: string]: BrowserWindow } = {};
    get windowList() {
        return Object.values(this.windows);
    }
    open(config) {
        const isObject = typeof config === 'object'; 
        const name = isObject? config.name: config;
        const win = new BrowserWindow({
            width: this.DEFAULT_WIDTH,
            height: this.DEFAULT_HEIGHT,
            webPreferences: {
                nodeIntegration: true,
                experimentalFeatures: true,
                webSecurity: false
            },
            frame: true,
        });

        this.registerWindow(win, name);
        Object.defineProperty(win, 'exec', {
            value: function exec(code) {
                return win.webContents.executeJavaScript(code);
            }
        });

        if(isObject && config.src) {
            const { src } = config;
            this.loadHTML(win, src);
        }
        return win;
    }

    loadWindow(window: BrowserWindow, file: string) {
        return this.loadHTML(window, file);
    }

    private loadHTML(window: BrowserWindow, file: string) {
        if(!path.extname(file)) file += '.html';

        // absolute path
        if(fs.existsSync(file)) {
            return this.loadURL(window, file);
        }
        // relative path
        else {
            const { relativePath } = Utils.lookup(file);
            if(relativePath) {
                return this.loadURL(window, relativePath);
            }
            else {
                console.error(`ERR: ${file} not found.`);
            }
        }
    }

    private loadURL(window: BrowserWindow, pathname: string) {
        window.loadURL(url.format({
            pathname,
            protocol: 'file',
            slashes: true
        }));
        return window;
    }

    private registerWindow(window: BrowserWindow, name: string | number) {
        if (name == null) {
            const noWindows = this.windowList.length;
            if (this.windows[noWindows]) {
                name = -1;
                while (!this.windows[++name]) { }
            }
            else {
                name = noWindows;
            }
        }
        else if(name in this.windows) {
            name += Object.keys(this.windows).filter(key => key.includes(name as string)).length.toString();
        }
        this.windows[name] = window;

        window.on('closed', () => delete this.windows[name]);
    }
}