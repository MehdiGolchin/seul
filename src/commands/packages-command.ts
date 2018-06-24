import { Command, RunCommandOptions } from "../command";
import { Log } from "../log";
import { Package } from "../package";
import { Repository } from "../repository";

export interface PackageInfo {
    readonly name: string;
    readonly version: string;
    readonly path: string;
}

export class PackagesCommand implements Command {

    name = "packages";

    async run({ services }: RunCommandOptions) {
        const repository = services.getService<Repository>("repository");
        const log = services.getService<Log>("log");

        const packages = await repository.allPackages();

        const info = await Promise.all(
            packages.map((pkg: Package) => this.mapDescriptor(pkg)),
        );

        log.table(info.filter((e) => e));
    }

    private async mapDescriptor(pkg: Package): Promise<PackageInfo | null> {
        try {
            const descriptor = await pkg.getDescriptor();
            return {
                name: descriptor.name,
                version: descriptor.version,
                path: pkg.root,
            };
        } catch (ex) {
            return null;
        }
    }

}
