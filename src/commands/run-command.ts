import { Command, RunCommandOptions } from "../command";
import { Log } from "../log";
import { Repository } from "../repository";
import { ScriptRunner } from "../script";

export class RunCommand implements Command {

    name = "run";

    async run({ services, params }: RunCommandOptions): Promise<any> {
        const { allPackages, options } = services.getService<Repository>("repository");
        const { error } = services.getService<Log>("log");
        const scriptName = params[0];
        if (!options.scripts) {
            return error("scripts not found.");
        }
        const scriptRunner = services.getService<ScriptRunner>("script");
        const packages = await allPackages();
        const scripts = options.scripts[scriptName];
        if (!scripts) {
            return error(`${scriptName} not found.`);
        }
        for (const pkg of packages) {
            await scriptRunner.exec(scripts);
        }
    }

}
