import { RunCommand } from "../../src/commands/run-command";
import { InMemoryLog } from "../../src/log";
import { RepositoryDescriptor } from "../../src/repository";
import { DefaultServiceProvider } from "../../src/service";
import { DummyScriptRunner, RepositoryBuilder } from "../builders";

describe("RunCommand Class", () => {

    test("should run a single script", async () => {
        // arrange
        const script = "yarn install";

        const descriptor: RepositoryDescriptor = {
            packagesDir: "packages",
            scripts: {
                install: script,
            },
        };

        const repository = new RepositoryBuilder("/repo")
            .addPackage("alpha", "1.0.0")
            .setOptions(descriptor)
            .build();

        const scriptRunner = new DummyScriptRunner(repository);

        const services = new DefaultServiceProvider()
            .addSingleton("script", scriptRunner)
            .addSingleton("repository", repository);

        // act
        await new RunCommand().run({
            services,
            params: ["install"],
        });

        // assert
        expect(scriptRunner.log).toEqual({
            alpha: [script],
        });
    });

    test("should run an array of scripts", async () => {
        // arrange
        const script = ["yarn build", "jest"];

        const descriptor: RepositoryDescriptor = {
            packagesDir: "packages",
            scripts: {
                test: script,
            },
        };

        const repository = new RepositoryBuilder("/repo")
            .addPackage("alpha", "1.0.0")
            .setOptions(descriptor)
            .build();

        const scriptRunner = new DummyScriptRunner(repository);

        const services = new DefaultServiceProvider()
            .addSingleton("script", scriptRunner)
            .addSingleton("repository", repository);

        // act
        await new RunCommand().run({
            services,
            params: ["test"],
        });

        // assert
        expect(scriptRunner.log).toEqual({
            alpha: script,
        });
    });

    test("should show error when scripts property does not exist", async () => {
        // arrange
        const descriptor: RepositoryDescriptor = {
            packagesDir: "packages",
        };

        const repository = new RepositoryBuilder("/repo")
            .addPackage("alpha", "1.0.0")
            .setOptions(descriptor)
            .build();

        const log = new InMemoryLog();

        const services = new DefaultServiceProvider()
            .addSingleton("script", new DummyScriptRunner(repository))
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
            .addPackage("alpha", "1.0.0")
            .addPackage("beta", "1.0.0")
            .addPackage("gamma", "1.0.0")
            .setOptions(descriptor)
            .build();

        const scriptRunner = new DummyScriptRunner(repository);

        const services = new DefaultServiceProvider()
            .addSingleton("script", scriptRunner)
            .addSingleton("repository", repository);

        // act
        await new RunCommand().run({
            services,
            params: ["clean", "alpha", "gamma"],
        });

        // assert
        expect(scriptRunner.log).toEqual({
            alpha: [script],
            gamma: [script],
        });
    });

    test("should run a bash command", async () => {
        // arrange
        const script = "yarn add jest --dev";

        const descriptor: RepositoryDescriptor = {
            packagesDir: "packages",
            scripts: {},
        };

        const repository = new RepositoryBuilder("/repo")
            .addPackage("alpha", "1.0.0")
            .setOptions(descriptor)
            .build();

        const scriptRunner = new DummyScriptRunner(repository);

        const services = new DefaultServiceProvider()
            .addSingleton("script", scriptRunner)
            .addSingleton("repository", repository)
            .addSingleton("log", new InMemoryLog());

        // act
        await new RunCommand().run({
            services,
            params: [script],
        });

        // assert
        expect(scriptRunner.log).toEqual({
            alpha: [script],
        });
    });

});
