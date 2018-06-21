import { Command, RunCommandOptions } from "../command";
import { Log } from "../log";
import { Package } from "../package";
import { Repository } from "../repository";

export class PackagesCommand implements Command {

    name = "packages";

    async run({ services }: RunCommandOptions) {
        const repository = services.getService<Repository>("repository");
        const log = services.getService<Log>("log");

        const packages = await repository.allPackages();

        await Promise.all(
            packages.map((pkg: Package) => this.writeInfo(pkg, log)),
        );
    }

    private async writeInfo(pkg: Package, log: Log) {
        try {
            const descriptor = await pkg.getDescriptor();
            log.write(`- ${descriptor.name} v${descriptor.version} (${pkg.root})`);
        } catch (ex) {
            log.error(`- '${pkg.root}' contains no package.json file.`);
        }
    }

}
