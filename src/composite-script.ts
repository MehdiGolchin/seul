import Package from "./package";
import { Script } from "./script-parser";
import ServiceProvider from "./service";

export default class CompositeScript implements Script {

    constructor(
        readonly services: ServiceProvider,
        readonly scripts: Script[],
        readonly continueOnError = false
    ) { }

    getAt<T extends Script>(index: number): T {
        return this.scripts[index] as T;
    }

    async exec(currentPackage: Package): Promise<any> {
        for (const script of this.scripts) {
            try {
                await script.exec(currentPackage);
            } catch (ex) {
                if (!this.continueOnError) {
                    throw ex;
                }
            }
        }
    }

}
