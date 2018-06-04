import * as cp from "child_process";
import { Script } from "vm";

export interface ScriptOutput {
    readonly stdout: string;
    readonly stderr: string;
}

export interface ScriptRunner {
    exec(...commands: string[]): Promise<ScriptOutput[]>;
}

export class DefaultScriptRunner implements ScriptRunner {

    async exec(...commands: string[]): Promise<ScriptOutput[]> {
        const output: ScriptOutput[] = [];
        for (const cmd of commands) {
            try {
                output.push(await this.execCommand(cmd));
            } catch (ex) {
                throw new ScriptExecError(output, ex.message);
            }
        }
        return output;
    }

    private execCommand(command: string): Promise<ScriptOutput> {
        return new Promise<ScriptOutput>((resolve, reject) => {
            cp.exec(command, {}, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                }
                resolve({ stdout, stderr });
            });
        });
    }

}

// tslint:disable-next-line:max-classes-per-file
export class ScriptExecError extends Error {

    constructor(readonly output: ScriptOutput[], message?: string | undefined) {
        super(message);
    }

}
