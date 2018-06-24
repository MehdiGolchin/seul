import { Command, RunCommandOptions } from "../command";
import { Repository } from "../repository";
import { ScriptRunner } from "../script";

export class RunCommand implements Command {

    name = "run";

    async run({ services, params }: RunCommandOptions): Promise<any> {
        const repository = services.getService<Repository>("repository");
        const scriptRunner = services.getService<ScriptRunner>("script");

        const scriptName = params[0];
        const packages = params.slice(1);

        const descriptor = await repository.getDescriptor();
        const scripts = descriptor.scripts ? descriptor.scripts[scriptName] : null;

        await scriptRunner.exec(scripts || scriptName, {
            packages: packages.length ? packages : undefined,
        });
    }

}
