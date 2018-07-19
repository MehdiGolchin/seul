import CommandScript from "../src/command-script";
import CompositeScript from "../src/composite-script";
import * as constants from "../src/constants";
import { FileScript } from "../src/file-scripts";
import { RepositoryDescriptor } from "../src/repository";
import { DefaultScriptParser } from "../src/script-parser";
import { DefaultServiceProvider } from "../src/service";
import DummyRepository from "./dummy-repository";

describe("ScriptParser", () => {

    describe("parse", () => {

        test("should return a command script", async () => {
            // arrange
            const scriptParser = setupParser({});

            // act
            const script = await scriptParser.parse("tsc") as CommandScript;

            // assert
            expect(script.command).toEqual("tsc");
        });

        test("should return a command script when label does not exist", async () => {
            // arrange
            const scriptParser = setupParser({
                scripts: {
                    build: "tsc"
                }
            });

            // act
            const script = await scriptParser.parse("foo") as CommandScript;

            // assert
            expect(script.command).toEqual("foo");
        });

        test("should find script by its label", async () => {
            // arrange
            const scriptParser = setupParser({
                scripts: {
                    build: "tsc"
                }
            });

            // act
            const script = await scriptParser.parse("build") as CommandScript;

            // assert
            expect(script.command).toEqual("tsc");
        });

        test("should return a composite command script", async () => {
            // arrange
            const scriptParser = setupParser({
                scripts: {
                    build: [
                        "rm -rf dist",
                        "tsc"
                    ]
                }
            });

            // act
            const script = await scriptParser.parse("build") as CompositeScript;

            // assert
            expect(script.continueOnError).toBeFalsy();
            expect(script.getAt<CommandScript>(0).command).toEqual("rm -rf dist");
            expect(script.getAt<CommandScript>(1).command).toEqual("tsc");
        });

        test("should return a file command script", async () => {
            // arrange
            const scriptParser = setupParser({
                scripts: {
                    build: "@exec ./build.js"
                }
            });

            // act
            const script = await scriptParser.parse("build") as FileScript;

            // assert
            expect(script.filename).toEqual("./build.js");
        });

        test("should execute exec as a simple command", async () => {
            // arrange
            const scriptParser = setupParser({
                scripts: {
                    build: "@exec"
                }
            });

            // act
            let error: Error | null = null;
            try {
                await scriptParser.parse("build");
            } catch (ex) {
                error = ex;
            }

            // assert
            expect(error.message).toEqual("'@exec' takes a script filename.");
        });

        test("should set continue on error to true", async () => {
            // arrange
            const scriptParser = setupParser({
                continueOnError: ["build"],
                scripts: {
                    build: [
                        "rm -rf dist",
                        "tsc"
                    ]
                }
            });

            // act
            const script = await scriptParser.parse("build") as CompositeScript;

            // assert
            expect(script.continueOnError).toBeTruthy();
        });

        test("should link build to clean", async () => {
            // arrange
            const scriptParser = setupParser({
                scripts: {
                    clean: "rm -rf dist",
                    build: [
                        "@clean",
                        "tsc"
                    ]
                }
            });

            // act
            const script = await scriptParser.parse("build") as CompositeScript;

            // assert
            expect(script.getAt<CommandScript>(0).command).toEqual("rm -rf dist");
            expect(script.getAt<CommandScript>(1).command).toEqual("tsc");
        });

        test("should throw error when script does not exist", async () => {
            // arrange
            const scriptParser = setupParser({
                scripts: {
                    build: [
                        "@clean",
                        "tsc"
                    ]
                }
            });

            // act
            let error: Error | null = null;
            try {
                await scriptParser.parse("build");
            } catch (ex) {
                error = ex;
            }

            // assert
            expect(error.message).toEqual("'clean' script not found.");
        });

        function setupParser(descriptor: Partial<RepositoryDescriptor>) {
            const services = new DefaultServiceProvider()
                .addFactory(
                    constants.repository,
                    () => new DummyRepository(services).setOptions(descriptor)
                );
            return new DefaultScriptParser(services);
        }

    });

});
