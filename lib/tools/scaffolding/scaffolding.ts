import { Scene } from "glaxier";
import { GPUPicker, ObjectAxesHelper } from "../helpers";
import { AxesScaffolding, AxesScaffoldingOptions } from "./axes.scaffolding";

export class Scaffolding {
    static axes(options: AxesScaffoldingOptions, extend: boolean = false) {
        const scaffolding = new AxesScaffolding(options);
        const scope = ('scope' in options)? options.scope: options;
        const { axesHelper, picker } = scaffolding;
        return Scaffolding.extend(extend? scope: {}, { axesHelper, picker, scaffolding }) as 
        { axesHelper: ObjectAxesHelper, picker: GPUPicker, scaffolding: AxesScaffolding };
    }

    private static extend(scope: any, properties: any) {
        Object.assign(scope, properties);
        return properties;
    }
}