import { RunCommand } from "../../src/commands/run-command";
import { InMemoryLog } from "../../src/log";
import { RepositoryDescriptor } from "../../src/repository";
import { DefaultServiceProvider } from "../../src/service";
import { DummyScriptRunner, RepositoryBuilder } from "../builders";

describe("RunCommand Class", () => {

    it("should run a single script", async () => {
        // arrange
        const descriptor: RepositoryDescriptor = {
            packagesDir: "packages",
            scripts: {
                install: "yarn install",
            },
        };

        const repository = new RepositoryBuilder("/repo")
            .addPackage("alpha", "1.0.0")
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
    });

    it("should run an array of scripts", async () => {
        // arrange
        const descriptor: RepositoryDescriptor = {
            packagesDir: "packages",
            scripts: {
                test: ["yarn build", "jest"],
            },
        };

        const repository = new RepositoryBuilder("/repo")
            .addPackage("alpha", "1.0.0")
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
    });

    it("should show error when scripts property does not exist", async () => {
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

    it("should show error when specific script does not exist", async () => {
        // arrange
        const descriptor: RepositoryDescriptor = {
            packagesDir: "packages",
            scripts: {
                install: "yarn install",
            },
        };

        const repository = new RepositoryBuilder("/repo")
            .addPackage("alpha", "1.0.0")
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

});
