import { Command, RunCommandOptions } from "../command";
import { ScriptRunner } from "../script-runner";
import * as constants from "../constants";

export class RunCommand implements Command {

    name = "run";

    async run({ services, params }: RunCommandOptions): Promise<any> {
        const scriptRunner = services.getService<ScriptRunner>(constants.scriptRunner);

        const command = params[0];
        const packages = params.slice(1);

        await scriptRunner.exec(command, {
            packages: packages.length ? packages : undefined,
        });
    }

}
