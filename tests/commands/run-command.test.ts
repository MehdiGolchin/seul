import { RunCommandOptions } from "../../src/command";
import { RunCommand } from "../../src/commands/run-command";
import { Log } from "../../src/log";
import { RepositoryOptions } from "../../src/repository";
import { DefaultServiceProvider } from "../../src/service";
import { ExecFunc, LogBuilder, RepositoryBuilder, ScriptRunnerBuilder } from "../builders";

describe("RunCommand Class", () => {

    it("should run script", async () => {
        // arrange
        const exec = jest.fn().mockImplementation(() => Promise.resolve([]));
        const log = new LogBuilder().build();
        const services = setupServices({
            scripts: {
                foo: "foo1",
            },
        }, exec, log);
        const options: RunCommandOptions = {
            services,
            params: ["foo"],
        };

        // act
        await new RunCommand().run(options);

        // assert
        expect(exec).toHaveBeenCalledTimes(2);
        expect(exec).toBeCalledWith("foo1");
    });

    it("should run all scripts", async () => {
        // arrange
        const exec = jest.fn().mockImplementation(() => Promise.resolve([]));
        const log = new LogBuilder().build();
        const services = setupServices({
            scripts: {
                foo: ["foo1", "foo2"],
            },
        }, exec, log);
        const options: RunCommandOptions = {
            services,
            params: ["foo"],
        };

        // act
        await new RunCommand().run(options);

        // assert
        expect(exec).toHaveBeenCalledTimes(2);
        expect(exec).toBeCalledWith(["foo1", "foo2"]);
    });

    it("should show error when scripts property does not exist", async () => {
        // arrange
        const error = jest.fn();
        const log = new LogBuilder().setError(error).build();
        const services = setupServices({}, jest.fn(), log);
        const options: RunCommandOptions = {
            services,
            params: ["foo"],
        };

        // act
        await new RunCommand().run(options);

        // assert
        expect(error).toHaveBeenCalledWith("scripts not found.");
    });

    it("should show error when specific script does not exist", async () => {
        // arrange
        const error = jest.fn();
        const log = new LogBuilder().setError(error).build();
        const services = setupServices({
            scripts: {
                something: "foo",
            },
        }, jest.fn(), log);
        const options: RunCommandOptions = {
            services,
            params: ["foo"],
        };

        // act
        await new RunCommand().run(options);

        // assert
        expect(error).toHaveBeenCalledWith(`foo not found.`);
    });

    function setupServices(options: Partial<RepositoryOptions>, exec: ExecFunc, log: Log) {
        const scriptRunner = new ScriptRunnerBuilder()
            .implementExec(exec)
            .build();

        const repository = new RepositoryBuilder()
            .addPackage("alpha", "1.0.0")
            .addPackage("beta", "1.0.0")
            .setOptions(options)
            .build();

        return new DefaultServiceProvider()
            .addSingleton("script", scriptRunner)
            .addSingleton("repository", repository)
            .addSingleton("log", log);
    }

});
