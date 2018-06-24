import { RunCommandOptions } from "../../src/command";
import { PackagesCommand } from "../../src/commands/packages-command";
import { InMemoryLog } from "../../src/log";
import { DefaultServiceProvider } from "../../src/service";
import { RepositoryBuilder } from "../builders";

describe("PackagesCommand", () => {

    test("should print a list of packages", async () => {
        // arrange
        const repository = new RepositoryBuilder("/repo")
            .addPackage("alpha", "1.0.0")
            .addPackage("beta", "2.0.0")
            .build();

        const log = new InMemoryLog();

        const services = new DefaultServiceProvider()
            .addSingleton("repository", repository)
            .addSingleton("log", log);

        const options: RunCommandOptions = {
            services,
            params: [],
        };

        // act
        await new PackagesCommand().run(options);

        // assert
        expect(log.data).toEqual([
            [
                { name: "alpha", version: "1.0.0", path: "/repo/packages/alpha" },
                { name: "beta", version: "2.0.0", path: "/repo/packages/beta" },
            ],
        ]);
    });

    test("should ignore the packages without descriptor", async () => {
        // arrange
        const repository = new RepositoryBuilder("/repo")
            .addPackage("alpha", "1.0.0")
            .addPackageWithoutDescriptor("beta")
            .build();

        const log = new InMemoryLog();

        const services = new DefaultServiceProvider()
            .addSingleton("repository", repository)
            .addSingleton("log", log);

        const options: RunCommandOptions = {
            services,
            params: [],
        };

        // act
        await new PackagesCommand().run(options);

        // assert
        expect(log.data).toEqual([
            [
                { name: "alpha", version: "1.0.0", path: "/repo/packages/alpha" },
            ],
        ]);
    });

});
