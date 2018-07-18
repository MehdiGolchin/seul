import { RunCommandOptions } from "../../src/command";
import { PackagesCommand } from "../../src/commands/packages-command";
import * as constants from "../../src/constants";
import { InMemoryLog } from "../../src/log";
import { DefaultServiceProvider } from "../../src/service";
import DummyRepository from "../dummy-repository";

describe("PackagesCommand", () => {

    test("should print a list of packages", async () => {
        // arrange
        const services = new DefaultServiceProvider()
            .addType(constants.log, InMemoryLog)
            .addFactory(constants.repository, (sp) => new DummyRepository(sp, "/repo")
                .addPackage("alpha", "1.0.0")
                .addPackage("beta", "2.0.0")
            );

        const options: RunCommandOptions = {
            services,
            params: []
        };

        // act
        await new PackagesCommand().run(options);

        // assert
        const log = services.getService<InMemoryLog>(constants.log);
        expect(log.data).toEqual([
            [
                { name: "alpha", version: "1.0.0", path: "/repo/packages/alpha" },
                { name: "beta", version: "2.0.0", path: "/repo/packages/beta" },
            ],
        ]);
    });

    test("should ignore the packages without descriptor", async () => {
        // arrange
        const services = new DefaultServiceProvider()
            .addType(constants.log, InMemoryLog)
            .addFactory(constants.repository, (sp) => new DummyRepository(sp, "/repo")
                .addPackage("alpha", "1.0.0")
                .addPackageWithoutDescriptor("beta")
            );

        const options: RunCommandOptions = {
            services,
            params: []
        };

        // act
        await new PackagesCommand().run(options);

        // assert
        const log = services.getService<InMemoryLog>(constants.log);
        expect(log.data).toEqual([
            [
                { name: "alpha", version: "1.0.0", path: "/repo/packages/alpha" },
            ],
        ]);
    });

});
