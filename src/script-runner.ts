import * as Constants from "./constants";
import { Repository } from "./repository";
import { ScriptParser } from "./script-parser";
import { ServiceProvider } from "./service";

export interface RunScriptOptions {
    readonly packages: string[];
}

export interface ScriptRunner {
    readonly services: ServiceProvider;
    exec(command: string, options: Partial<RunScriptOptions>): Promise<any>;
}

export class DefaultScriptRunner implements ScriptRunner {

    constructor(readonly services: ServiceProvider) { }

    async exec(command: string, options: Partial<RunScriptOptions> = {}): Promise<any> {
        const scriptParser = this.services.getService<ScriptParser>(Constants.ScriptParser);
        const repository = this.services.getService<Repository>(Constants.Repository);
        const script = await scriptParser.parse(command);
        const packages = await repository.allPackages();
        for (const pkg of packages) {
            // ignoring packages which are not mentioned in the list
            if (options.packages) {
                const packageDescriptor = await pkg.getDescriptor();
                if (options.packages.indexOf(packageDescriptor.name) === -1) {
                    continue;
                }
            }
            await script.exec(pkg);
        }
    }

}
