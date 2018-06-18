import { RunCommandOptions } from "../../src/command";
import { PackagesCommand } from "../../src/commands/packages-command";
import { Log } from "../../src/log";
import { Repository } from "../../src/repository";
import { DefaultServiceProvider } from "../../src/service";
import { LogBuilder, RepositoryBuilder } from "../builders";

describe("PackagesCommand", () => {

    test("should print a list of packages", async () => {
        // arrange
        const repository = new RepositoryBuilder()
            .addPackage("alpha", "1.0.0")
            .addPackage("beta", "2.0.0")
            .build();

        const log = new LogBuilder()
            .setWrite(jest.fn())
            .build();

        const options = createCommandOptions(repository, log);

        // act
        await new PackagesCommand().run(options);

        // assert
        expect(log.write).toHaveBeenCalledWith(
            "- alpha v1.0.0 (/packages/alpha)\n- beta v2.0.0 (/packages/beta)",
        );
    });

    test("should ignore a package without descriptor", async () => {
        // arrange
        const repository = new RepositoryBuilder()
            .addPackage("alpha", "1.0.0")
            .addPackageWithoutDescriptor("foo")
            .build();

        const log = new LogBuilder()
            .setWrite(jest.fn())
            .build();

        const options = createCommandOptions(repository, log);

        // act
        await new PackagesCommand().run(options);

        // assert
        expect(log.write).toHaveBeenCalledWith(
            "- alpha v1.0.0 (/packages/alpha)",
        );
    });

    function createCommandOptions(repository: Repository, log: Log, ...params: string[]) {
        const services = new DefaultServiceProvider()
            .addSingleton("repository", repository)
            .addSingleton("log", log);

        const options: RunCommandOptions = {
            services,
            params,
        };

        return options;
    }

});
