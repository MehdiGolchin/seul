import { Log } from "./log";
import { Repository } from "./repository";

export interface RunCommandOptions {
    readonly repository: Repository;
    readonly log: Log;
    readonly params: string[];
}

export interface CommandCreator {
    new(): Command;
}

export interface Command {
    readonly name: string;
    run(options: RunCommandOptions): Promise<any>;
}

export interface CommandExecutor {
    exec(...args: string[]): Promise<any>;
}

export class DefaultCommandExecutor implements CommandExecutor {

    private readonly commands: { [name: string]: Command };

    constructor(
        readonly repository: Repository,
        readonly log: Log,
        ...commands: CommandCreator[],
    ) {
        this.commands = commands.reduce(
            (prev, ctor) => {
                const cmd = new ctor();
                return { ...prev, [cmd.name]: cmd };
            }, {});
    }

    async exec(...args: string[]) {
        const name = args[0];
        const command = this.commands[name];
        const params = args.slice(1);

        if (!command) {
            throw new Error(`Unsupported command '${name}'.`);
        }

        const options: RunCommandOptions = {
            repository: this.repository,
            log: this.log,
            params,
        };
        return command.run(options);
    }

}
