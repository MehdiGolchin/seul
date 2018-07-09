import { Package } from "./package";
import { Script } from "./script-parser";
import { ServiceProvider } from "./service";

export class CompositeScript implements Script {

    constructor(readonly services: ServiceProvider, readonly scripts: Script[]) { }

    getAt<T extends Script>(index: number): T {
        return this.scripts[index] as T;
    }

    async exec(currentPackage: Package): Promise<any> {
        for (const script of this.scripts) {
            await script.exec(currentPackage);
        }
    }

}
