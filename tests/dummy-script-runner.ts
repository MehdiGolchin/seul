import { RunScriptOptions, ScriptRunner } from "../src/script";
import { ServiceProvider } from "../src/service";

export class DummyScriptRunner implements ScriptRunner {

    readonly log: { [name: string]: string } = {};

    constructor(readonly services: ServiceProvider) { }

    async exec(command: string, options: Partial<RunScriptOptions>): Promise<any> {
        if (options.packages) {
            options.packages.forEach((p) => this.log[p] = command);
        } else {
            this.log.all = command;
        }
    }

}
