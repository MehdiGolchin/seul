import { Log } from "../src/log";
import { Command, RunCommandOptions, DefaultCommandExecutor, CommandCreator } from "../src/command";
import { Package, Repository } from "../src/repository";

export class RepositoryBuilder {

    private readonly packages: Package[] = [];

    addPackage(name: string, version: string): RepositoryBuilder {
        this.packages.push({
            path: `/packages/${name}`,
            getDescriptor: () => Promise.resolve({ name, version })
        });
        return this;
    }

    addPackageWithoutDescriptor(name: string): RepositoryBuilder {
        this.packages.push({
            path: `/packages/${name}`,
            getDescriptor: () => Promise.reject(new Error('File does not exist.'))
        });
        return this;
    }

    build(): Repository {
        const repo: Repository = {
            root: '/',
            allPackages: () => Promise.resolve(this.packages)
        };
        return repo;
    }

}

export type LogFunc = (message: string) => void;

export const DefaultLogFunc: LogFunc = _ => { };

export class LogBuilder {

    private write: LogFunc = DefaultLogFunc;

    setWrite(fn: LogFunc) {
        this.write = fn;
        return this;
    }

    build(): Log {
        const log: Log = {
            write: this.write
        };

        return log;
    }

}

export type CommandRunFunc = (options: RunCommandOptions) => Promise<any>;

export class CommandExecutorBuilder {

    private commands: CommandCreator[] = [];

    registerCommand(name: string, run: CommandRunFunc) {
        class DummyCommand implements Command { name = name; run = run }
        this.commands.push(DummyCommand);
        return this;
    }

    build() {
        return new DefaultCommandExecutor(
            {} as Repository,
            {} as Log,
            ...this.commands
        );
    }

}