jest.mock("fs");
// tslint:disable-next-line:no-var-requires
const fs = require("fs");

import { DefaultRepository } from "../src/repository";

describe("DefaultRepository Class", () => {

    describe("allPackages", () => {

        test("should return all packages", async () => {
            // arrange
            fs.__mkdir("/repo/pkg/alpha");
            fs.__mkdir("/repo/pkg/beta");
            fs.__writeFile("/repo/pkg/foo.json");
            fs.__writeFile("/repo/pkg.json");

            const repository = new DefaultRepository("/repo", { packagesDir: "pkg" });

            // act
            const packages = await repository.allPackages();

            // assert
            expect(packages).toEqual([
                { root: "/repo/pkg/alpha" },
                { root: "/repo/pkg/beta" },
            ]);
        });

        test("should throw error when packages directory does not exist", async () => {
            // arrange
            const repository = new DefaultRepository("/repo");

            // act
            let error: Error = null;
            try {
                await repository.allPackages();
            } catch (ex) {
                error = ex;
            }

            // assert
            expect(error.message).toEqual("Packages not found.");
        });

    });

    describe("getDescriptor", () => {

        test("should load packages descriptor", async () => {
            // arrange
            fs.__writeJson("/repo/packages.json", {
                packages: "/pkg",
            });

            const repository = new DefaultRepository("/repo", {
                packagesDir: "/packages",
                foo: "10",
            });

            // act
            const descriptor = await repository.getDescriptor();

            // assert
            expect(descriptor.packages).toEqual("/pkg");
            expect(descriptor.foo).toEqual("10");
        });

    });

});

afterEach(fs.__clear);
