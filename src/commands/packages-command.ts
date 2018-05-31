import { Command, RunCommandOptions } from '../command';
import { Package, PackageDescriptor } from '../repository';

export class PackagesCommand implements Command {

    name = 'packages';

    async run({ repository, log }: RunCommandOptions) {
        const packages = await repository.allPackages();
        const outputs = await Promise.all(
            packages.map((pkg: Package) => this.generateText(pkg))
        );
        log.write(outputs.filter(e => e.trim() != '').join('\n'));
    }

    private async generateText(pkg: Package) {
        try {
            let descriptor = await pkg.getDescriptor();
            return `- ${descriptor.name} v${descriptor.version} (${pkg.path})`;
        } catch (ex) {
            return '';
        }
    }

}