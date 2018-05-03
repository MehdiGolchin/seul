
export interface ICommand {
    name: string
    run(...params: string[]): void
}

export interface ICommandExecutor {
    exec(...args: string[]): boolean
}

export class CommandExecutor implements ICommandExecutor {

    private readonly commands: { [name: string]: ICommand }

    constructor(...commands: ICommand[]) {
        this.commands = commands.reduce(
            (p, c) => ({ ...p, [c.name]: c }), {}
        );
    }

    exec(...args: string[]): boolean {
        const name = args[0];
        const command = this.commands[name];
        const params = args.slice(1)

        if (!command) return false;
        command.run(...params);

        return true;
    }

}
