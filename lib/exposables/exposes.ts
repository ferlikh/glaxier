import { Exposable, Initializer } from "./exposable";

export class Exposes {
    static prop(expose: Exposable, init?: Initializer) {
        let get, set;
        const hasInitializerFn = typeof init === 'function';
        if('value' in expose) {
            get = () => expose.value;
            set = value => expose.value = value;
        }
        else if('set' in expose) {
            get = hasInitializerFn? init.bind(expose): undefined;
            set = value => expose.set(value);
            
        }
        else {
            get = hasInitializerFn? init: undefined;
            set = expose;
        }

        if(!hasInitializerFn && init !== undefined) {
            set(init);
        }

        return { get, set, enumerable: true }
    }
}