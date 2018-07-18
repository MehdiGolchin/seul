import * as fs from "fs";
import * as path from "path";

export interface PackageDescriptor {
    readonly name: string;
    readonly version: string;
}

export default class Package {

    constructor(readonly root: string) { }

    getDescriptor(): Promise<PackageDescriptor> {
        return new Promise((resolve, reject) => {
            const fullPath = path.join(this.root, "package.json");
            fs.readFile(fullPath, "utf8", (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(JSON.parse(data));
            });
        });
    }

}
