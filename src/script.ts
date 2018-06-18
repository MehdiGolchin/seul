import * as cp from "child_process";
import { Log } from "./log";

export interface ScriptRunner {
    exec(commands: string | string[]): Promise<any[]>;
}

export class DefaultScriptRunner implements ScriptRunner {

    constructor(readonly log: Log) { }

    exec(commands: string | string[]): Promise<any[]> {
        if (Array.isArray(commands)) {
            const promises = commands.map((c) => this.execCommand(c));
            return Promise.all(promises);
        } else {
            return this.execCommand(commands);
        }
    }

    private execCommand(command: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            cp.exec(command, {}, (err, stdout, stderr) => {
                if (err) {
                    return reject(err);
                }
                if (stdout) {
                    this.log.write(stdout);
                } else {
                    this.log.error(stderr);
                }
                resolve();
            });
        });
    }

}
