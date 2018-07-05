import { Package } from "./package";
import { Script } from "./script-parser";
import { ServiceProvider } from "./service";

export class CompositeScript implements Script {

    constructor(readonly services: ServiceProvider, readonly scripts: Script[]) { }

    getAt<T extends Script>(index: number): T {
        return this.scripts[index] as T;
    }

    exec(currentPackage: Package): Promise<any> {
        throw new Error("Not implemented method.");
    }

}
