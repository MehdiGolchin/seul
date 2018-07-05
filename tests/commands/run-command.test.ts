import { RunCommand } from "../../src/commands/run-command";
import * as Constants from "../../src/constants";
import { DefaultServiceProvider } from "../../src/service";
import { DummyScriptRunner } from "../dummy-script-runner";

describe("RunCommand Class", () => {

    test("should run a command in all packages", async () => {
        // arrange
        const command = "install";
        const services = new DefaultServiceProvider();
        const scriptRunner = new DummyScriptRunner(services);
        services.addInstance(Constants.ScriptRunner, scriptRunner);

        // act
        await new RunCommand().run({
            services,
            params: [command],
        });

        // assert
        expect(scriptRunner.log).toEqual({
            all: command,
        });
    });

    test("should run a command in the specific packages", async () => {
        // arrange
        const command = "rm -rf dist";
        const services = new DefaultServiceProvider();
        const scriptRunner = new DummyScriptRunner(services);
        services.addInstance(Constants.ScriptRunner, scriptRunner);

        // act
        await new RunCommand().run({
            services,
            params: [command, "alpha", "beta"],
        });

        // assert
        expect(scriptRunner.log).toEqual({
            alpha: command,
            beta: command,
        });
    });

});
