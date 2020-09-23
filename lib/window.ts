// import windowManager from 'electron-window-manager';


// export function window(name, title, content, setupTemplate, setup, showDevTools) {
    // return windowManager.open(name, title, content, setupTemplate, setup, showDevTools);
export function window(windowManager) {
    return (name, template) => windowManager.open(name, template);
}