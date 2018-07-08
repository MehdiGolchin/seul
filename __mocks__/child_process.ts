import { EventEmitter } from "events";

const cp: any = jest.genMockFromModule("child_process");

type CommandFunc = (context: SpawnContext, options: ExecutionOptions) => number;

interface ExecutionOptions {
    readonly cwd: string;
    readonly env: any;
}

let commands: { [name: string]: CommandFunc } = {};

function __registerCommand(command: string, code: CommandFunc) {
    commands[command] = code;
}

function __clear() {
    commands = {};
}

export class SpawnContext extends EventEmitter {
    constructor(
        readonly args: string[],
        readonly stdout = new EventEmitter(),
        readonly stderr = new EventEmitter()
    ) {
        super();
    }
}

function spawn(command: string, args: string[], options: ExecutionOptions): SpawnContext {
    const cmd = commands[command];
    const context = new SpawnContext(args);
    setTimeout(() => {
        const code = cmd(context, options);
        context.emit("close", code);
    }, 0);
    return context;
}

cp.__registerCommand = __registerCommand;
cp.__clear = __clear;
cp.spawn = spawn;

module.exports = cp;
