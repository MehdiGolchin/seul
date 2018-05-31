    import {RunCommandOptions} from '../src/command';
    import {CommandExecutorBuilder} from "./builder";

    describe('CommandExecutor Class', () => {

        describe('exec Method', () => {

            test('should execute a command', () => {
                // arrange
                const expected = 'OK';

                const executor = new CommandExecutorBuilder()
                    .registerCommand('test', () => Promise.resolve(expected))
                    .build();

                // act
                const promise = executor.exec('test');

                // assert
                expect(promise).resolves.toBe(expected);
            });

            test('should reject promise when command does not exist', () => {
                // arrange
                const executor = new CommandExecutorBuilder().build();

                // act
                const promise = executor.exec('test');

                // assert
                expect(promise).rejects.toEqual(expect.objectContaining({
                    message: "Unsupported command 'test'."
                }));
            });

            test('should pass the parameters to the command', () => {
                // arrange
                const executor = new CommandExecutorBuilder()
                    .registerCommand('test', (p: RunCommandOptions) => Promise.resolve(p.params))
                    .build();

                // act
                const promise = executor.exec('test', '123');

                // assert
                expect(promise).resolves.toEqual(['123']);
            });

            test('should reject promise when command throws error', () => {
                // arrange
                const error = new Error('An error!');

                const executor = new CommandExecutorBuilder()
                    .registerCommand('test', () => { throw error })
                    .build();

                // act
                const promise = executor.exec('test');

                // assert
                expect(promise).rejects.toEqual(error);
            });

        });

    });
