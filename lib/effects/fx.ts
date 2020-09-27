import { glitchEffect } from "./glitch";

/**
 * A namespace for effects resources.
 */
export default class FX {

    static glitch(scene) {
        return glitchEffect(scene);
    }
}