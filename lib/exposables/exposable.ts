import { Settable, Valuable } from 'glaxier/utils';
export type Exposable = Function | Settable | Valuable;
export type Initializer<T = any> = T | Function;

export function exposable(object, name) {
    return function (setter, initializer?: Initializer) {
        const hasInitializerFn = initializer instanceof Function;
        const key = Symbol();
        const getter = hasInitializerFn?
            initializer: () => object[key];
        if(initializer && !hasInitializerFn) object[key] = initializer;

        const descriptor = Object.getOwnPropertyDescriptor(object, name);

        if(!descriptor) {
            Object.defineProperty(object, name, {
                get: getter,
                set: (value) => {
                    object[key] = value;
                    setter(value);
                },
                configurable: true,
            });
        }
        else {
            Object.defineProperty(object, name, {
                get: getter,
                set: (value) => {
                    descriptor.set(value);
                    setter(value);
                },
                configurable: true,
            });
        }
    }
}