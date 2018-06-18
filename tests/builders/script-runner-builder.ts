import { ScriptRunner } from "../../src/script";

export type ExecFunc = (...commands: string[]) => Promise<any[]>;

export class ScriptRunnerBuilder {

    private execFunc: ExecFunc = null;

    implementExec(fn: ExecFunc): ScriptRunnerBuilder {
        this.execFunc = fn;
        return this;
    }

    build(): ScriptRunner {
        return {
            exec: this.execFunc,
        };
    }

}
