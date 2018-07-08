import * as Constants from "../src/constants";
import { DefaultScriptRunner } from "../src/script-runner";
import { DefaultServiceProvider } from "../src/service";
import { DummyRepository } from "./dummy-repository";
import { DummyScriptParser } from "./dummy-script-parser";

describe("ScriptRunner", () => {

    describe("exec", () => {

        test("should run a command in all packages", async () => {
            // arrange
            const services = setupServices();

            const pwd = jest.fn();
            services
                .getService<DummyScriptParser>(Constants.ScriptParser)
                .addRule("pwd", pwd);

            const executor = new DefaultScriptRunner(services);

            // act
            await executor.exec("pwd");

            // assert
            const repository = services.getService<DummyRepository>(Constants.Repository);
            expect(pwd.mock.calls).toEqual([
                [repository.getPackage("alpha")],
                [repository.getPackage("beta")],
            ]);
        });

        test("should run a command in a specific package", async () => {
            // arrange
            const services = setupServices();

            const pwd = jest.fn();
            services
                .getService<DummyScriptParser>(Constants.ScriptParser)
                .addRule("pwd", pwd);

            const executor = new DefaultScriptRunner(services);

            // act
            await executor.exec("pwd", {
                packages: ["beta"],
            });

            // assert
            const repository = services.getService<DummyRepository>(Constants.Repository);
            expect(pwd).toHaveBeenCalledTimes(1);
            expect(pwd).toHaveBeenCalledWith(repository.getPackage("beta"));
        });

        test("should run a command in a specific package", async () => {
            // arrange
            const services = setupServices();
            const executor = new DefaultScriptRunner(services);

            // act
            let error: Error | null = null;
            try {
                await executor.exec("pwd");
            } catch (ex) {
                error = ex;
            }

            // assert
            expect(error).toEqual(new Error("Rule not found."));
        });

        function setupServices() {
            return new DefaultServiceProvider()
                .addFactory(Constants.Repository, (sp) => new DummyRepository(sp, "/repo")
                    .addPackage("alpha", "1.0.0")
                    .addPackage("beta", "1.0.0")
                )
                .addType(Constants.ScriptParser, DummyScriptParser);
        }

    });

});
