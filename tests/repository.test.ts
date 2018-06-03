jest.mock("fs");
// tslint:disable-next-line:no-var-requires
const fs = require("fs");

import { DefaultRepository } from "../src/repository";

describe("DefaultRepository Class", () => {

    describe("allPackages", () => {

        it("should return all packages", async () => {
            // arrange
            fs.__mkdir("/pkg/alpha");
            fs.__mkdir("/pkg/beta");
            fs.__writeFile("/pkg/foo.json");
            fs.__writeFile("/pkg.json");

            const repository = new DefaultRepository("/", { packagesDir: "pkg" });

            // act
            const packages = await repository.allPackages();

            // assert
            expect(packages).toEqual([
                { root: "/pkg/alpha" },
                { root: "/pkg/beta" },
            ]);
        });

        it("should ignore directories without package descriptor", () => {
            // arrange
            const repository = new DefaultRepository("/");

            // act
            const promise = repository.allPackages();

            // assert
            expect(promise).rejects.toThrow("Directory does not exist.");
        });

    });

});

afterEach(() => {
    fs.__clear();
});
