import { Package } from "./package";
import { Script } from "./script-parser";
import { ServiceProvider } from "./service";

export class CommandScript implements Script {

    constructor(readonly services: ServiceProvider, readonly command: string) { }

    exec(currentPackage: Package): Promise<any> {
        throw new Error("Not implemented.");
    }

}
