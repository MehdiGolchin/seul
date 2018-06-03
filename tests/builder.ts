import { Command, CommandCreator, DefaultCommandExecutor, RunCommandOptions } from "../src/command";
import { Log } from "../src/log";
import { Package } from "../src/package";
import { Repository } from "../src/repository";

export class RepositoryBuilder {

    private readonly packages: Package[] = [];

    addPackage(name: string, version: string): RepositoryBuilder {
        this.packages.push({
            root: `/packages/${name}`,
            getDescriptor: () => Promise.resolve({ name, version }),
        });
        return this;
    }

    addPackageWithoutDescriptor(name: string): RepositoryBuilder {
        this.packages.push({
            root: `/packages/${name}`,
            getDescriptor: () => Promise.reject(new Error("File does not exist.")),
        });
        return this;
    }

    build(): Repository {
        const repo: Repository = {
            root: "/",
            allPackages: () => Promise.resolve(this.packages)
        };
        return repo;
    }

}

export type LogFunc = (message: string) => void;

export const DefaultLogFunc: LogFunc = () => true;

// tslint:disable-next-line:max-classes-per-file
export class LogBuilder {

    private write: LogFunc = DefaultLogFunc;

    setWrite(fn: LogFunc) {
        this.write = fn;
        return this;
    }

    build(): Log {
        const log: Log = {
            write: this.write,
        };

        return log;
    }

}

export type CommandRunFunc = (options: RunCommandOptions) => Promise<any>;

// tslint:disable-next-line:max-classes-per-file
export class CommandExecutorBuilder {

    private commands: CommandCreator[] = [];

    registerCommand(name: string, run: CommandRunFunc) {
        // tslint:disable-next-line:max-classes-per-file
        class DummyCommand implements Command { name = name; run = run; }
        this.commands.push(DummyCommand);
        return this;
    }

    build() {
        return new DefaultCommandExecutor(
            {} as Repository,
            {} as Log,
            ...this.commands,
        );
    }

}
