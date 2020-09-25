export function window(windowManager) {
    return (name, template) => windowManager.open(name, template);
}