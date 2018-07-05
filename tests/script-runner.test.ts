import * as Constants from "../src/constants";
import { DefaultScriptRunner } from "../src/script-runner";
import { DefaultServiceProvider } from "../src/service";
import { DummyRepository } from "./dummy-repository";
import { DummyScriptParser } from "./dummy-script-parser";

describe("ScriptRunner", () => {

    describe("exec", () => {

        test("should run a command in all packages", async () => {
            // arrange
            const services = new DefaultServiceProvider();

            const repository = new DummyRepository(services, "/repo")
                .addPackage("alpha", "1.0.0")
                .addPackage("beta", "1.0.0");

            const pwd = jest.fn();
            const scriptParser = new DummyScriptParser(services)
                .addRule("pwd", pwd);

            services
                .addInstance(Constants.Repository, repository)
                .addInstance(Constants.ScriptParser, scriptParser);

            const executor = new DefaultScriptRunner(services);

            // act
            await executor.exec("pwd");

            // assert
            expect(pwd.mock.calls).toEqual([
                [repository.getPackage("alpha")],
                [repository.getPackage("beta")],
            ]);
        });

        test("should run a command in a specific package", async () => {
            // arrange
            const services = new DefaultServiceProvider();

            const repository = new DummyRepository(services, "/repo")
                .addPackage("alpha", "1.0.0")
                .addPackage("beta", "1.0.0");

            const pwd = jest.fn();
            const scriptParser = new DummyScriptParser(services)
                .addRule("pwd", pwd);

            services
                .addInstance(Constants.Repository, repository)
                .addInstance(Constants.ScriptParser, scriptParser);

            const executor = new DefaultScriptRunner(services);

            // act
            await executor.exec("pwd", {
                packages: ["beta"],
            });

            // assert
            expect(pwd).toHaveBeenCalledTimes(1);
            expect(pwd).toHaveBeenCalledWith(repository.getPackage("beta"));
        });

    });

});
