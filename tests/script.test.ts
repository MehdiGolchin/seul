jest.mock("child_process");
// tslint:disable-next-line:no-var-requires
const cp = require("child_process");

import { InMemoryLog } from "../src/log";
import { DefaultScriptRunner } from "../src/script";
import { RepositoryBuilder } from "./builders";

describe("ScriptRunner Class", () => {

    describe("exec", () => {

        test("should execute a command in all packages", async () => {
            // arrange
            cp.__registerCommand("pwd", (context: any) => {
                context.write(context.options.cwd);
            });

            const log = new InMemoryLog();

            const repository = new RepositoryBuilder("/repo")
                .addPackage("alpha", "1.0.0")
                .addPackage("beta", "1.0.0")
                .build();

            const executor = new DefaultScriptRunner(repository, log);

            // act
            await executor.exec("pwd");

            // assert
            expect(log.info).toEqual([
                "/repo/packages/alpha",
                "/repo/packages/beta",
            ]);
        });

        test("should add .bin directory to path variable", async () => {
            // arrange
            cp.__registerCommand("pwd", (context: any) => {
                context.write(context.options.env.PATH);
            });

            const log = new InMemoryLog();

            const repository = new RepositoryBuilder("/repo")
                .addPackage("alpha", "1.0.0")
                .addPackage("beta", "1.0.0")
                .build();

            const executor = new DefaultScriptRunner(repository, log);

            // act
            await executor.exec("pwd");

            // assert
            expect(log.info.shift()).toContain("/repo/packages/alpha/node_modules/.bin");
            expect(log.info.shift()).toContain("/repo/packages/beta/node_modules/.bin");
        });

        test("should execute a command and log the error", async () => {
            // arrange
            const expected = "Unknown command.";

            cp.__registerCommand("foo", (context: any) => {
                context.error(expected);
            });

            const repository = new RepositoryBuilder()
                .addPackage("alpha", "1.0.0")
                .build();

            const log = new InMemoryLog();

            const executor = new DefaultScriptRunner(repository, log);

            // act
            await executor.exec("foo");

            // assert
            expect(log.errors).toEqual([expected]);
        });

        test("should handle error when something went wrong", async () => {
            // arrange
            const expected = new Error("foo has an error");
            cp.__registerCommand("buggy", () => { throw expected; });

            const repository = new RepositoryBuilder()
                .addPackage("alpha", "1.0.0")
                .build();

            const executor = new DefaultScriptRunner(repository, new InMemoryLog());

            // act
            let actual: Error | null = null;
            try {
                await executor.exec("buggy");
            } catch (ex) {
                actual = ex;
            }

            // assert
            expect(actual).toEqual(expected);
        });

        test("should execute a list of scripts", async () => {
            // arrange
            cp.__registerCommand("first", (context: any) => context.write("first called"));
            cp.__registerCommand("second", (context: any) => context.write("second called"));

            const repository = new RepositoryBuilder()
                .addPackage("alpha", "1.0.0")
                .build();

            const log = new InMemoryLog();

            const executor = new DefaultScriptRunner(repository, log);

            // act
            await executor.exec(["first", "second"]);

            // assert
            expect(log.info).toEqual([
                "first called",
                "second called",
            ]);
        });

        test("should execute a command in a specific package", async () => {
            // arrange
            cp.__registerCommand("pwd", (context: any) => context.write(context.options.cwd));

            const repository = new RepositoryBuilder("/repo")
                .addPackage("alpha", "1.0.0")
                .addPackage("beta", "1.0.0")
                .build();

            const log = new InMemoryLog();

            const executor = new DefaultScriptRunner(repository, log);

            // act
            await executor.exec("pwd", { packages: ["beta"] });

            // assert
            expect(log.info).toEqual(["/repo/packages/beta"]);
        });

    });

});

afterEach(cp.__clear);
