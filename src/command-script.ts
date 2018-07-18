import { spawn } from "child_process";
import * as path from "path";
import * as constants from "./constants";
import Log from "./log";
import Package from "./package";
import { Script } from "./script-parser";
import ServiceProvider from "./service";

export default class CommandScript implements Script {

    constructor(readonly services: ServiceProvider, readonly command: string) { }

    exec(currentPackage: Package): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const log = this.services.getService<Log>(constants.log);
            const args = this.command.split(" ");
            const name = args.shift();
            if (!name) {
                return reject(new Error("Invalid command."));
            }
            const nodeBinPath = path.join(currentPackage.root, "/node_modules/.bin");
            const cmd = spawn(name, args, {
                cwd: currentPackage.root,
                env: {
                    PATH: `${process.env.PATH}:${nodeBinPath}`
                }
            });
            cmd.stdout.on("data", (data: Buffer) => {
                log.write(data.toString("utf8"));
            });
            cmd.stderr.on("data", (data: Buffer) => {
                log.error(data.toString("utf8"));
            });
            cmd.on("error", (err: Error) => {
                log.error(err.message);
            });
            cmd.on("close", (code) => {
                if (code !== 0) {
                    return reject(new Error(`${name} has exited with code ${code}.`));
                }
                resolve();
            });
        });
    }

}
