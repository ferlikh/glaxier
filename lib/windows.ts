import { WindowManager } from "./window-manager";

export function window(config) {
    return WindowManager.open(config);
}