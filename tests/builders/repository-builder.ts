import { Command, CommandCreator, DefaultCommandExecutor, RunCommandOptions } from "../../src/command";
import { Package } from "../../src/package";
import { Repository, RepositoryOptions } from "../../src/repository";

export class RepositoryBuilder {

    private readonly packages: Package[] = [];
    private options: RepositoryOptions = { packagesDir: "packages" };

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

    setOptions(properties: Partial<RepositoryOptions>): RepositoryBuilder {
        this.options = { ...this.options, ...properties };
        return this;
    }

    build(): Repository {
        const repo: Repository = {
            root: "/",
            options: this.options,
            allPackages: () => Promise.resolve(this.packages),
        };
        return repo;
    }

}
