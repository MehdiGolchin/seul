import * as cp from "child_process";
import { Log } from "./log";
import { Package } from "./package";
import { Repository } from "./repository";

export interface RunScriptOptions {
    readonly cwd: string;
}

export interface ScriptRunner {
    exec(commands: string | string[]): Promise<any>;
}

export class DefaultScriptRunner implements ScriptRunner {

    constructor(readonly repository: Repository, readonly log: Log) { }

    async exec(commands: string | string[]): Promise<any> {
        const packages = await this.repository.allPackages();
        for (const pkg of packages) {
            if (Array.isArray(commands)) {
                const promises = commands.map((c) => this.execCommand(c, pkg));
                await Promise.all(promises);
            } else {
                await this.execCommand(commands, pkg);
            }
        }
    }

    private execCommand(command: string, pkg: Package): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            cp.exec(command, { cwd: pkg.root }, (err, stdout, stderr) => {
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
