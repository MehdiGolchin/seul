import { ScriptRunner, RunScriptOptions } from "../../src/script";

export class DummyScriptRunner implements ScriptRunner {

    log: string[] = [];
    packages: string[] = [];

    exec(commands: string | string[], options: Partial<RunScriptOptions>): Promise<any> {
        return new Promise<any>((resolve) => {
            if (Array.isArray(commands)) {
                this.log = [...this.log, ...commands];
            } else {
                this.log.push(commands);
            }
            this.packages = options.packages;
            resolve();
        });
    }

}
