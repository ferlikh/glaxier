import { glitchEffect } from "./glitch";
import { sobelEffect } from "./sobel";

/**
 * A namespace for effects resources.
 */

export default class FX {

    static glitch(scene) {
        return glitchEffect(scene);
    }

    static sobel(scene) {
        return sobelEffect(scene);
    }
    
}