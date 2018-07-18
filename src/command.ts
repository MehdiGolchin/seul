import ServiceProvider from "./service";

export interface RunCommandOptions {
    readonly services: ServiceProvider;
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

export interface CommandCollection {
    [name: string]: Command;
}

export class DefaultCommandExecutor implements CommandExecutor {

    private readonly commands: CommandCollection;

    constructor(
        readonly services: ServiceProvider,
        ...commands: CommandCreator[]
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
            services: this.services,
            params,
        };
        return command.run(options);
    }

}
