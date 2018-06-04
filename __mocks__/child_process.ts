import { ChildProcess } from "child_process";

const cp: any = jest.genMockFromModule("child_process");

type ExecCallback = (error: Error, stdout: string, stderr: string) => void;
type ExecFunc = (command: string, options: any, callback: ExecCallback) => void;

let execFunc: ExecFunc;

function __implementExec(fn: ExecFunc) {
    execFunc = fn;
}

function exec(command: string, options: any, callback: ExecCallback) {
    execFunc(command, options, callback);
}

cp.__implementExec = __implementExec;
cp.exec = exec;

module.exports = cp;
