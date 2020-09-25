export default function exposable(object, name) {
    return function (setter, initializer?: Function | any) {
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