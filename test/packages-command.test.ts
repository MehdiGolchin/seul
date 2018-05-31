import { LogBuilder, RepositoryBuilder } from "./builder";
import { PackagesCommand } from "../src/commands/packages-command";
import { RunCommandOptions } from "../src/command";

describe('PackagesCommand', () => {

    describe('run', () => {

        test('should print a list of packages', async () => {
            // arrange
            const repoBuilder = new RepositoryBuilder()
                .addPackage('alpha', '1.0.0')
                .addPackage('beta', '2.0.0');

            const logBuilder = new LogBuilder()
                .setWrite(jest.fn());

            const options: RunCommandOptions = {
                repository: repoBuilder.build(),
                log: logBuilder.build(),
                params: []
            };

            const command = new PackagesCommand();

            // act
            await command.run(options);

            // assert
            expect(options.log.write).toHaveBeenCalledWith(
                '- alpha v1.0.0 (/packages/alpha)\n- beta v2.0.0 (/packages/beta)'
            );
        });

        test('should ignore a package without descriptor', async () => {
            // arrange
            const repoBuilder = new RepositoryBuilder()
                .addPackage('alpha', '1.0.0')
                .addPackageWithoutDescriptor('foo');

            const logBuilder = new LogBuilder()
                .setWrite(jest.fn());

            const options: RunCommandOptions = {
                repository: repoBuilder.build(),
                log: logBuilder.build(),
                params: []
            };

            const command = new PackagesCommand();

            // act
            await command.run(options);

            // assert
            expect(options.log.write).toHaveBeenCalledWith(
                '- alpha v1.0.0 (/packages/alpha)'
            );
        });

    });

});