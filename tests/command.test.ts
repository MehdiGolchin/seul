import { RunCommandOptions } from "../src/command";
import { CommandExecutorBuilder } from "./command-executor-builder";

describe("CommandExecutor", () => {

    describe("exec", () => {

        test("should execute a command", async () => {
            // arrange
            const expected = "OK";

            const executor = new CommandExecutorBuilder()
                .registerCommand("test", () => Promise.resolve(expected))
                .build();

            // act
            const output = await executor.exec("test");

            // assert
            expect(output).toEqual(expected);
        });

        test("should throw error when command does not exist", async () => {
            // arrange
            const executor = new CommandExecutorBuilder().build();

            // act
            let error: Error | null = null;
            try {
                await executor.exec("test");
            } catch (ex) {
                error = ex;
            }

            // assert
            expect(error).toEqual(new Error("Unsupported command 'test'."));
        });

        test("should pass the parameters into the command", async () => {
            // arrange
            const executor = new CommandExecutorBuilder()
                .registerCommand("test", (p: RunCommandOptions) => Promise.resolve(p.params))
                .build();

            // act
            const output = await executor.exec("test", "123", "ABC");

            // assert
            expect(output).toEqual(["123", "ABC"]);
        });

        test("should throw error when something went wrong", async () => {
            // arrange
            const expected = new Error("An error!");

            const executor = new CommandExecutorBuilder()
                .registerCommand("test", () => { throw expected; })
                .build();

            // act
            let actual: Error | null = null;
            try {
                await executor.exec("test");
            } catch (ex) {
                actual = ex;
            }

            // assert
            expect(actual).toEqual(expected);
        });

    });

});
