import * as fs from "fs";
import * as path from "path";
import { Package } from "./package";

export interface RepositoryOptions {
    readonly packagesDir: string;
}

export interface Repository {
    readonly root: string;
    allPackages(): Promise<Package[]>;
}

export class DefaultRepository implements Repository {

    constructor(
        readonly root: string,
        readonly options: RepositoryOptions = { packagesDir: "packages" },
    ) { }

    async allPackages() {
        const fullPath = path.join(this.root, this.options.packagesDir);
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

}
