import { glitchEffect } from "./glitch";
import { grayEffect } from "./gray";
import { sobelEffect } from "./sobel";

/**
 * A namespace for effects resources.
 */

export default class FX {

    static glitch(scene) {
        return glitchEffect(scene);
    }

    static gray(scene) {
        return grayEffect(scene);
    }

    static sobel(scene) {
        return sobelEffect(scene);
    }
    
}