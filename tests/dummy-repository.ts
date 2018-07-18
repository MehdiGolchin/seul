import * as path from "path";
import Package from "../src/package";
import Repository, { RepositoryDescriptor } from "../src/repository";
import ServiceProvider from "../src/service";

export default class DummyRepository implements Repository {

    private readonly packages: Package[] = [];
    private readonly indexedPackages: { [name: string]: Package } = {};
    private options: Partial<RepositoryDescriptor>;

    constructor(
        readonly services: ServiceProvider,
        readonly root: string = "/",
        readonly initialOptions: RepositoryDescriptor = { packagesDir: "/packages" },
    ) { }

    addPackage(name: string, version: string): DummyRepository {
        const pkg: Package = {
            root: path.join(this.root, "packages", name),
            getDescriptor: () => Promise.resolve({ name, version }),
        };
        this.packages.push(pkg);
        this.indexedPackages[name] = pkg;
        return this;
    }

    getPackage(name: string): Package {
        return this.indexedPackages[name];
    }

    addPackageWithoutDescriptor(name: string): DummyRepository {
        this.packages.push({
            root: path.join(this.root, "packages", name),
            getDescriptor: () => Promise.reject(new Error("File does not exist.")),
        });
        return this;
    }

    setOptions(properties: Partial<RepositoryDescriptor>): DummyRepository {
        this.options = { ...this.options, ...properties };
        return this;
    }

    allPackages(): Promise<Package[]> {
        return Promise.resolve(this.packages);
    }

    getDescriptor(): Promise<RepositoryDescriptor> {
        return Promise.resolve({ ...this.initialOptions, ...this.options });
    }

}
