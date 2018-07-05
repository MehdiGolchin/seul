import { Command, CommandCreator, DefaultCommandExecutor, RunCommandOptions } from "../src/command";
import { DefaultServiceProvider } from "../src/service";

export type CommandRunFunc = (options: RunCommandOptions) => Promise<any>;

export class CommandExecutorBuilder {

    private commands: CommandCreator[] = [];
    private services = new DefaultServiceProvider();

    registerCommand(name: string, run: CommandRunFunc) {
        // tslint:disable-next-line:max-classes-per-file
        class DummyCommand implements Command { name = name; run = run; }
        this.commands.push(DummyCommand);
        return this;
    }

    build() {
        return new DefaultCommandExecutor(
            this.services,
            ...this.commands,
        );
    }

}
