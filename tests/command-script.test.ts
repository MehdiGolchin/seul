jest.mock("child_process");

// tslint:disable-next-line:no-var-requires
const cp = require("child_process");

import { CommandScript } from "../src/command-script";
import * as Constants from "../src/constants";
import { InMemoryLog } from "../src/log";
import { Package } from "../src/package";
import { DefaultServiceProvider } from "../src/service";

describe("CommandScript", () => {

    describe("exec", () => {

        test("should throw exception when command is empty", async () => {
            // arrange
            const services = new DefaultServiceProvider()
                .addType(Constants.Log, InMemoryLog);

            const commandScript = new CommandScript(services, "");
            const currentPackage = new Package("/repo/packages/mypkg");

            // act
            let error: Error | null = null;
            try {
                await commandScript.exec(currentPackage);
            } catch (ex) {
                error = ex;
            }

            // assert
            expect(error).toEqual(new Error("Invalid command."));
        });

        test("should execute a command", async () => {
            // arrange
            cp.__registerCommand("pwd", (context, options) => {
                context.stdout.emit("data", Buffer.from(options.cwd));
                return 0;
            });

            const services = new DefaultServiceProvider()
                .addType(Constants.Log, InMemoryLog);

            const packagePath = "/repo/packages/mypkg";

            const pwd = new CommandScript(services, "pwd");
            const currentPackage = new Package(packagePath);

            // act
            await pwd.exec(currentPackage);

            // assert
            const log = services.getService<InMemoryLog>(Constants.Log);
            expect(log.info).toEqual([packagePath]);
        });

        test("should log the error", async () => {
            // arrange
            const error = "An error occurred";

            cp.__registerCommand("foo", (context) => {
                context.stderr.emit("data", Buffer.from(error));
                return 0;
            });

            const services = new DefaultServiceProvider()
                .addType(Constants.Log, InMemoryLog);

            const commandScript = new CommandScript(services, "foo");
            const currentPackage = new Package("/repo/packages/mypkg");

            // act
            await commandScript.exec(currentPackage);

            // assert
            const log = services.getService<InMemoryLog>(Constants.Log);
            expect(log.errors).toEqual([error]);
        });

        test("should have access to the node commnds", async () => {
            // arrange
            cp.__registerCommand("env", (context, options) => {
                context.stdout.emit("data", Buffer.from(options.env.PATH, "utf8"));
                return 0;
            });

            const services = new DefaultServiceProvider()
                .addType(Constants.Log, InMemoryLog);

            const packagePath = "/repo/packages/mypkg";

            const env = new CommandScript(services, "env");
            const currentPackage = new Package(packagePath);

            // act
            await env.exec(currentPackage);

            // assert
            const log = services.getService<InMemoryLog>(Constants.Log);
            expect(log.info.shift()).toContain(`${packagePath}/node_modules/.bin`);
        });

        test("should pass the args", async () => {
            // arrange
            cp.__registerCommand("foo", (context) => {
                context.stdout.emit("data", Buffer.from(context.args[0], "utf8"));
                return 0;
            });

            const services = new DefaultServiceProvider()
                .addType(Constants.Log, InMemoryLog);

            const pwd = new CommandScript(services, "foo -h");
            const currentPackage = new Package("/repo/packages/mypkg");

            // act
            await pwd.exec(currentPackage);

            // assert
            const log = services.getService<InMemoryLog>(Constants.Log);
            expect(log.info).toEqual(["-h"]);
        });

        test("should throw an exception when exit code is not zero", async () => {
            // arrange
            cp.__registerCommand("foo", () => 1);

            const services = new DefaultServiceProvider()
                .addType(Constants.Log, InMemoryLog);

            const path = "/repo/packages/mypkg";
            const commandScript = new CommandScript(services, "foo");
            const currentPackage = new Package(path);

            // act
            let error: Error | null = null;
            try {
                await commandScript.exec(currentPackage);
            } catch (ex) {
                error = ex;
            }

            // assert
            expect(error).toEqual(new Error("foo has exited with code 1."));
        });

        beforeEach(cp.__clear);

    });

});
