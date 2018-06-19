import * as fs from "fs";
import * as path from "path";
import { Package } from "./package";

export interface Script {
    [key: string]: string | string[];
}

export interface RepositoryOptions {
    readonly packagesDir: string;
    readonly scripts?: Script;
    readonly [key: string]: any;
}

export interface Repository {
    readonly root: string;
    readonly options: RepositoryOptions;
    allPackages(): Promise<Package[]>;
}

export class DefaultRepository implements Repository {

    constructor(
        readonly root: string,
        readonly options: RepositoryOptions = { packagesDir: "packages" },
    ) { }

    async allPackages() {
        const fullPath = path.join(this.root, this.options.packagesDir);
        if (!(await this.exists(fullPath))) {
            throw new Error("Packages not found.");
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

}
