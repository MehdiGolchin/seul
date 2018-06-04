jest.mock("child_process");
// tslint:disable-next-line:no-var-requires
const cp = require("child_process");

import { DefaultScriptRunner, ScriptExecError, ScriptOutput } from "../src/script";

describe("ScriptRunner Class", () => {

    describe("exec", () => {

        it("should execute a command and receive stdout", async () => {
            // arrange
            const foo = { stdout: "Yep! I'm foo", stderr: null };
            const executor = new DefaultScriptRunner();
            setupExec({ foo });
            // act
            const output = await executor.exec("foo");
            // assert
            expect(output).toEqual([foo]);
        });

        it("should execute a command and receive stderr", async () => {
            // arrange
            const foo = { stdout: null, stderr: "No! I'm not foo" };
            const executor = new DefaultScriptRunner();
            setupExec({ foo });
            // act
            const output = await executor.exec("foo");
            // assert
            expect(output).toEqual([foo]);
        });

        it("should reject when something went wrong", async () => {
            // arrange
            const foo = new Error("foo has an error");
            const executor = new DefaultScriptRunner();
            setupExec({ foo });
            // act
            let actual: Error = null;
            try {
                await executor.exec("foo");
            } catch (ex) {
                actual = ex;
            }
            // assert
            expect(actual).toEqual(foo);
        });

        it("should execute a list of scripts", async () => {
            // arrange
            const first = { stdout: "I'm foo1", stderr: null };
            const second = { stdout: "I'm foo2", stderr: null };
            const executor = new DefaultScriptRunner();
            setupExec({ first, second });
            // act
            const output = await executor.exec("first", "second");
            // assert
            expect(output).toEqual([first, second]);
        });

        it("should stop execution when an error occured", async () => {
            // arrange
            const first = { stdout: "I'm foo1", stderr: null };
            const second = new Error("second has an error");
            const third = { stdout: "I'm foo3", stderr: null };
            const executor = new DefaultScriptRunner();
            setupExec({ first, second, third });
            // act
            let error: ScriptExecError = null;
            try {
                await executor.exec("first", "second", "third");
            } catch (ex) {
                error = ex;
            }
            // assert
            expect(error.output).toEqual([first]);
            expect(error.message).toEqual(second.message);
        });

        it("should stop execution when an error occured", async () => {
            // arrange
            const first = { stdout: "I'm foo1", stderr: null };
            const second = new Error("second has an error");
            const third = { stdout: "I'm foo3", stderr: null };
            const executor = new DefaultScriptRunner();
            setupExec({ first, second, third });
            // act
            let error: ScriptExecError = null;
            try {
                await executor.exec("first", "second", "third");
            } catch (ex) {
                error = ex;
            }
            // assert
            expect(error.output).toEqual([first]);
            expect(error.message).toEqual(second.message);
        });

        function setupExec(definition: { [command: string]: ScriptOutput | Error }) {
            cp.__implementExec(jest.fn().mockImplementation(
                (
                    cmd: string,
                    opt: any,
                    cb: (err: Error, stdout: string, stderr: string) => void,
                ) => {
                    const result = definition[cmd];
                    if (result instanceof Error) {
                        cb(result, null, null);
                    } else {
                        cb(null, result.stdout, result.stderr);
                    }
                },
            ));
        }

    });

});
