import { Command, RunCommandOptions } from "../command";
import { ScriptRunner } from "../script-runner";
import * as Constants from "../constants";

export class RunCommand implements Command {

    name = "run";

    async run({ services, params }: RunCommandOptions): Promise<any> {
        const scriptRunner = services.getService<ScriptRunner>(Constants.ScriptRunner);

        const command = params[0];
        const packages = params.slice(1);

        await scriptRunner.exec(command, {
            packages: packages.length ? packages : undefined,
        });
    }

}
