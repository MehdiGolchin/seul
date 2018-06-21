import { ScriptRunner } from "../../src/script";

export class DummyScriptRunner implements ScriptRunner {

    log: string[] = [];

    exec(commands: string | string[]): Promise<any> {
        return new Promise<any>((resolve) => {
            if (Array.isArray(commands)) {
                this.log = [...this.log, ...commands];
            } else {
                this.log.push(commands);
            }
            resolve();
        });
    }

}
