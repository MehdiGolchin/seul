import { CommandScript } from "../src/command-script";
import { CompositeScript } from "../src/composite-script";
import * as Constants from "../src/constants";
import { RepositoryDescriptor } from "../src/repository";
import { DefaultScriptParser } from "../src/script-parser";
import { DefaultServiceProvider } from "../src/service";
import { DummyRepository } from "./dummy-repository";

describe("ScriptParser", () => {

    describe("parse", () => {

        test("should return a command script", async () => {
            // arrange
            const scriptParser = setupParser({
                scripts: {},
            });

            // act
            const script = await scriptParser.parse("tsc") as CommandScript;

            // assert
            expect(script.command).toEqual("tsc");
        });

        test("should return a command script", async () => {
            // arrange
            const scriptParser = setupParser({
                scripts: {
                    build: "tsc",
                },
            });

            // act
            const script = await scriptParser.parse("build") as CommandScript;

            // assert
            expect(script.command).toEqual("tsc");
        });

        test("should return a list of command script", async () => {
            // arrange
            const scriptParser = setupParser({
                scripts: {
                    build: [
                        "rm -rf dist",
                        "tsc",
                    ],
                },
            });

            // act
            const script = await scriptParser.parse("build") as CompositeScript;

            // assert
            expect(script.getAt<CommandScript>(0).command).toEqual("rm -rf dist");
            expect(script.getAt<CommandScript>(1).command).toEqual("tsc");
        });

        test("should return a label script", async () => {
            // arrange
            const scriptParser = setupParser({
                scripts: {
                    clean: "rm -rf dist",
                    build: [
                        "@clean",
                        "tsc",
                    ],
                },
            });

            // act
            const script = await scriptParser.parse("build") as CompositeScript;

            // assert
            expect(script.getAt<CommandScript>(0).command).toEqual("rm -rf dist");
            expect(script.getAt<CommandScript>(1).command).toEqual("tsc");
        });

        function setupParser(descriptor: Partial<RepositoryDescriptor>) {
            const services = new DefaultServiceProvider()
                .addFactory(
                    Constants.Repository,
                    () => new DummyRepository(services).setOptions(descriptor),
            );
            return new DefaultScriptParser(services);
        }

    });

});
