// I've put the setupChildProcess in the beginning, because we
// have to call jest.mock("child_process") before anything else.
import { LogBuilder, setupChildProcess } from "./builders";
// tslint:disable-next-line:ordered-imports
import { DefaultScriptRunner } from "../src/script";

describe("ScriptRunner Class", () => {

    describe("exec", () => {

        it("should execute a command and receive stdout", async () => {
            // arrange
            const expected = "Yep! I'm foo";
            setupChildProcess({ foo: { stdout: expected, stderr: null } });

            const write = jest.fn();
            const log = new LogBuilder().setWrite(write).build();
            const executor = new DefaultScriptRunner(log);

            // act
            await executor.exec("foo");

            // assert
            expect(write).toHaveBeenCalledWith(expected);
        });

        it("should execute a command and receive stderr", async () => {
            // arrange
            const expected = "No! I'm not foo";
            setupChildProcess({ foo: { stdout: null, stderr: expected } });

            const error = jest.fn();
            const log = new LogBuilder().setError(error).build();
            const executor = new DefaultScriptRunner(log);

            // act
            const output = await executor.exec("foo");

            // assert
            expect(error).toHaveBeenCalledWith(expected);
        });

        it("should reject when something went wrong", async () => {
            // arrange
            const expected = new Error("foo has an error");
            setupChildProcess({ foo: expected });

            const log = new LogBuilder().build();
            const executor = new DefaultScriptRunner(log);

            // act
            let actual: Error = null;
            try {
                await executor.exec("foo");
            } catch (ex) {
                actual = ex;
            }

            // assert
            expect(actual).toEqual(expected);
        });

        it("should execute a list of scripts", async () => {
            // arrange
            const first = "I'm foo1";
            const second = "I'm foo2";
            setupChildProcess({
                first: { stdout: first, stderr: null },
                second: { stdout: second, stderr: null },
            });

            const write = jest.fn();
            const log = new LogBuilder().setWrite(write).build();
            const executor = new DefaultScriptRunner(log);

            // act
            await executor.exec(["first", "second"]);

            // assert
            expect(write.mock.calls).toEqual([
                [first],
                [second],
            ]);
        });

    });

});
