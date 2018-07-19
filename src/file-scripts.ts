import * as path from "path";
import * as constants from "./constants";
import Package from "./package";
import Repository from "./repository";
import { Script } from "./script-parser";
import ServiceProvider from "./service";

export type ScriptFn = (currentPackage: Package, services: ServiceProvider) => Promise<any>;

export class FileScript implements Script {

    constructor(readonly services: ServiceProvider, readonly filename: string) {
        if (!filename || !filename.length) {
            throw new Error("'@exec' takes a script filename.");
        }
    }

    async exec(currentPackage: Package): Promise<any> {
        const fullname = path.join(currentPackage.root, this.filename);
        const fn: ScriptFn = require(fullname);
        await fn(currentPackage, this.services);
    }

}
