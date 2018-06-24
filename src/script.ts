import * as cp from "child_process";
import * as path from "path";
import { Log } from "./log";
import { Package } from "./package";
import { Repository } from "./repository";

export interface RunScriptOptions {
    readonly packages: string[];
}

export interface ScriptRunner {
    exec(commands: string | string[], options: Partial<RunScriptOptions>): Promise<any>;
}

export class DefaultScriptRunner implements ScriptRunner {

    constructor(readonly repository: Repository, readonly log: Log) { }

    async exec(commands: string | string[], options: Partial<RunScriptOptions> = {}): Promise<any> {
        const packages = await this.repository.allPackages();

        for (const pkg of packages) {
            // ignoring packages which are not mentioned in the list
            if (options.packages) {
                const descriptor = await pkg.getDescriptor();
                if (options.packages.indexOf(descriptor.name) === -1) {
                    continue;
                }
            }

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
            const options = {
                cwd: pkg.root,
                env: {
                    PATH: `${process.env.PATH}:${path.join(pkg.root, "node_modules/.bin")}`,
                },
            };
            cp.exec(command, options, (err, stdout, stderr) => {
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
