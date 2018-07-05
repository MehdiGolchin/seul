import { RunCommandOptions } from "../../src/command";
import { PackagesCommand } from "../../src/commands/packages-command";
import * as Constants from "../../src/constants";
import { InMemoryLog } from "../../src/log";
import { DefaultServiceProvider } from "../../src/service";
import { DummyRepository } from "../dummy-repository";

describe("PackagesCommand", () => {

    test("should print a list of packages", async () => {
        // arrange
        const log = new InMemoryLog();
        const services = new DefaultServiceProvider()
            .addInstance(Constants.Log, log);

        const repository = new DummyRepository(services, "/repo")
            .addPackage("alpha", "1.0.0")
            .addPackage("beta", "2.0.0");

        services.addInstance(Constants.Repository, repository);

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
        const services = new DefaultServiceProvider();

        const repository = new DummyRepository(services, "/repo")
            .addPackage("alpha", "1.0.0")
            .addPackageWithoutDescriptor("beta");

        const log = new InMemoryLog();

        services
            .addInstance(Constants.Repository, repository)
            .addInstance(Constants.Log, log);

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
