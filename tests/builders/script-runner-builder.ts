import { Repository } from "../../src/repository";
import { RunScriptOptions, ScriptRunner } from "../../src/script";

export class DummyScriptRunner implements ScriptRunner {

    readonly log: { [name: string]: string[] } = {};

    constructor(readonly repository: Repository) { }

    async exec(commands: string | string[], options: Partial<RunScriptOptions>): Promise<any> {
        const packages = await this.repository.allPackages();
        for (const pkg of packages) {
            const descriptor = await pkg.getDescriptor();

            if (options.packages && options.packages.indexOf(descriptor.name) === -1) {
                continue;
            }

            let value = this.log[descriptor.name];
            if (!value) {
                this.log[descriptor.name] = value = [];
            }

            if (Array.isArray(commands)) {
                value.push(...commands);
            } else {
                value.push(commands);
            }
        }
    }

}
