const cp: any = jest.genMockFromModule("child_process");

type ExecCallback = (error: Error, stdout: string, stderr: string) => void;
type CommandFunc = (context: ExecContext) => void;

interface ExecOptions {
    readonly cwd: string;
    readonly env: any;
}

class ExecContext {

    private stdout: string[] = [];
    private stderr: string[] = [];

    constructor(readonly options: ExecOptions) { }

    write(str: string) {
        this.stdout.push(str);
    }

    error(message: string) {
        this.stderr.push(message);
    }

    getStdout() {
        if (!this.stdout.length) {
            return null;
        }
        return this.stdout.join();
    }

    getStderr() {
        if (!this.stderr.length) {
            return null;
        }
        return this.stderr.join();
    }

}

let commands: { [name: string]: CommandFunc } = {};

function __registerCommand(command: string, code: CommandFunc) {
    commands[command] = code;
}

function __clear() {
    commands = {};
}

function exec(command: string, options: ExecOptions, callback: ExecCallback) {
    const context = new ExecContext(options);
    const cmd = commands[command];
    try {
        cmd(context);
        callback(null, context.getStdout(), context.getStderr());
    } catch (err) {
        callback(err, null, null);
    }
}

cp.__registerCommand = __registerCommand;
cp.__clear = __clear;
cp.exec = exec;

module.exports = cp;
