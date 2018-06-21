import { Command, RunCommandOptions } from "../command";
import { Log } from "../log";
import { Repository } from "../repository";
import { ScriptRunner } from "../script";

export class RunCommand implements Command {

    name = "run";

    async run({ services, params }: RunCommandOptions): Promise<any> {
        const repository = services.getService<Repository>("repository");
        const log = services.getService<Log>("log");
        const scriptRunner = services.getService<ScriptRunner>("script");

        const scriptName = params[0];
        const descriptor = await repository.getDescriptor();
        if (!descriptor.scripts) {
            return log.error("Please define your scripts in packages.json file.");
        }

        const scripts = descriptor.scripts[scriptName];
        if (!scripts) {
            return log.error(`'${scriptName}' not defined.`);
        }

        await scriptRunner.exec(scripts);
    }

}
