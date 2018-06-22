import { RunCommand } from "../../src/commands/run-command";
import { InMemoryLog } from "../../src/log";
import { RepositoryDescriptor } from "../../src/repository";
import { DefaultServiceProvider } from "../../src/service";
import { DummyScriptRunner, RepositoryBuilder } from "../builders";

describe("RunCommand Class", () => {

    test("should run a single script", async () => {
        // arrange
        const descriptor: RepositoryDescriptor = {
            packagesDir: "packages",
            scripts: {
                install: "yarn install",
            },
        };

        const repository = new RepositoryBuilder("/repo")
            .setOptions(descriptor)
            .build();

        const scriptRunner = new DummyScriptRunner();

        const services = new DefaultServiceProvider()
            .addSingleton("script", scriptRunner)
            .addSingleton("repository", repository);

        // act
        await new RunCommand().run({
            services,
            params: ["install"],
        });

        // assert
        expect(scriptRunner.log).toEqual(["yarn install"]);
        expect(scriptRunner.packages).toBeUndefined();
    });

    test("should run an array of scripts", async () => {
        // arrange
        const descriptor: RepositoryDescriptor = {
            packagesDir: "packages",
            scripts: {
                test: ["yarn build", "jest"],
            },
        };

        const repository = new RepositoryBuilder("/repo")
            .setOptions(descriptor)
            .build();

        const scriptRunner = new DummyScriptRunner();

        const services = new DefaultServiceProvider()
            .addSingleton("script", scriptRunner)
            .addSingleton("repository", repository);

        // act
        await new RunCommand().run({
            services,
            params: ["test"],
        });

        // assert
        expect(scriptRunner.log).toEqual(["yarn build", "jest"]);
        expect(scriptRunner.packages).toBeUndefined();
    });

    test("should show error when scripts property does not exist", async () => {
        // arrange
        const descriptor: RepositoryDescriptor = {
            packagesDir: "packages",
        };

        const repository = new RepositoryBuilder("/repo")
            .setOptions(descriptor)
            .build();

        const log = new InMemoryLog();

        const services = new DefaultServiceProvider()
            .addSingleton("script", new DummyScriptRunner())
            .addSingleton("repository", repository)
            .addSingleton("log", log);

        // act
        await new RunCommand().run({
            services,
            params: ["test"],
        });

        // assert
        expect(log.errors).toEqual(["Please define your scripts in packages.json file."]);
    });

    test("should show error when specific script does not exist", async () => {
        // arrange
        const descriptor: RepositoryDescriptor = {
            packagesDir: "packages",
            scripts: {
                install: "yarn install",
            },
        };

        const repository = new RepositoryBuilder("/repo")
            .setOptions(descriptor)
            .build();

        const log = new InMemoryLog();

        const services = new DefaultServiceProvider()
            .addSingleton("script", new DummyScriptRunner())
            .addSingleton("repository", repository)
            .addSingleton("log", log);

        // act
        await new RunCommand().run({
            services,
            params: ["test"],
        });

        // assert
        expect(log.errors).toEqual(["'test' not defined."]);
    });

    test("should run a single command in the specific packages", async () => {
        // arrange
        const script = "rm -rf dist";

        const descriptor: RepositoryDescriptor = {
            packagesDir: "packages",
            scripts: {
                clean: script,
            },
        };

        const repository = new RepositoryBuilder("/repo")
            .setOptions(descriptor)
            .build();

        const scriptRunner = new DummyScriptRunner();

        const services = new DefaultServiceProvider()
            .addSingleton("script", scriptRunner)
            .addSingleton("repository", repository);

        // act
        await new RunCommand().run({
            services,
            params: ["clean", "alpha", "gamma"],
        });

        // assert
        expect(scriptRunner.log).toEqual([script]);
        expect(scriptRunner.packages).toEqual(["alpha", "gamma"]);
    });

});
