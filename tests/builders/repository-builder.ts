import * as path from "path";
import { Package } from "../../src/package";
import { Repository, RepositoryDescriptor } from "../../src/repository";

export class RepositoryBuilder {

    private readonly packages: Package[] = [];
    private options: RepositoryDescriptor = { packagesDir: "packages" };

    constructor(readonly root: string = "/") { }

    addPackage(name: string, version: string): RepositoryBuilder {
        this.packages.push({
            root: path.join(this.root, "packages", name),
            getDescriptor: () => Promise.resolve({ name, version }),
        });
        return this;
    }

    addPackageWithoutDescriptor(name: string): RepositoryBuilder {
        this.packages.push({
            root: path.join(this.root, "packages", name),
            getDescriptor: () => Promise.reject(new Error("File does not exist.")),
        });
        return this;
    }

    setOptions(properties: Partial<RepositoryDescriptor>): RepositoryBuilder {
        this.options = { ...this.options, ...properties };
        return this;
    }

    build(): Repository {
        const repo: Repository = {
            root: this.root,
            initialOptions: this.options,
            allPackages: () => Promise.resolve(this.packages),
            getDescriptor: () => Promise.resolve(this.options),
        };
        return repo;
    }

}
