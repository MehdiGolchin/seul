import * as fs from "fs";
import * as path from "path";
import Package from "./package";
import ServiceProvider from "./service";

export interface Script {
    [key: string]: string | string[];
}

export interface RepositoryDescriptor {
    readonly packagesDir: string;
    readonly scripts?: Script;
    readonly continueOnError?: string[];
    readonly [key: string]: any;
}

export default interface Repository {
    readonly services: ServiceProvider;
    readonly root: string;
    readonly initialOptions: RepositoryDescriptor;
    allPackages(): Promise<Package[]>;
    getDescriptor(): Promise<RepositoryDescriptor>;
}

export class DefaultRepository implements Repository {

    private cachedDescriptor: RepositoryDescriptor | null = null;

    constructor(
        readonly services: ServiceProvider,
        readonly root: string,
        readonly initialOptions: RepositoryDescriptor = { packagesDir: "packages" },
    ) { }

    async getDescriptor(): Promise<RepositoryDescriptor> {
        if (this.cachedDescriptor) {
            return this.cachedDescriptor;
        }

        const fullPath = path.join(this.root, "packages.json");

        try {
            const descriptor = await this.readJson(fullPath);

            return this.cachedDescriptor = {
                ...this.initialOptions,
                ...descriptor,
            };
        } catch (ex) {
            return this.initialOptions;
        }
    }

    async allPackages() {
        const descriptor = await this.getDescriptor();
        const fullPath = path.join(this.root, descriptor.packagesDir);

        const packagesExists = await this.exists(fullPath);
        if (!packagesExists) {
            throw new Error(`Packages not found. (${fullPath})`);
        }

        const paths = await this.readDirectory(fullPath);
        const packages: Package[] = [];
        for (const p of paths) {
            const packagePath = path.join(fullPath, p);
            if (await this.isDirectory(packagePath)) {
                packages.push(new Package(packagePath));
            }
        }
        return packages;
    }

    private isDirectory(fullPath: string) {
        return new Promise<boolean>((resolve, reject) => {
            fs.stat(fullPath, (err, stat) => {
                if (err) {
                    return reject(err);
                }
                const isDir = stat.isDirectory();
                resolve(isDir);
            });
        });
    }

    private readDirectory(fullPath: string) {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(fullPath, (err, paths) => {
                if (err) {
                    return reject(err);
                }
                resolve(paths);
            });
        });
    }

    private exists(fullpath: string) {
        return new Promise<boolean>((resolve) => {
            fs.exists(fullpath, (exists) => {
                resolve(exists);
            });
        });
    }

    private readJson<T>(fullPath: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            fs.readFile(fullPath, "utf8", (err: Error, data: string) => {
                if (err) {
                    return reject(err);
                }
                const json = JSON.parse(data) as T;
                resolve(json);
            });
        });
    }

}
