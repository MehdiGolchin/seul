import * as path from 'path';
import * as fs from 'fs';

export interface PackageDescriptor {
    readonly name: string,
    readonly version: string
}

export class Package {

    constructor(readonly path: string) { }

    getDescriptor(): Promise<PackageDescriptor> {
        return new Promise((resolve, reject) => {
            const fullPath = path.join(this.path, 'package.json');
            fs.readFile(fullPath, 'utf8', (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(JSON.parse(data));
            });
        });
    }

}

export interface Repository {
    readonly root: string;
    allPackages(): Promise<Package[]>;
}

export class DefaultRepository implements Repository {

    constructor(readonly root: string) { }

    async allPackages() {
        const fullPath = path.join(this.root, 'packages');
        const paths = await this.readDirectory(fullPath);
        const packages: Package[] = [];
        for (let p of paths) {
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
                const isDir = stat.isDirectory()
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