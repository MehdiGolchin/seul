jest.mock("fs");
// tslint:disable-next-line:no-var-requires
const fs = require("fs");

import { Package } from "../src/package";

describe("Package Class", () => {

    describe("getDescriptor", () => {

        it("should return package descriptor", async () => {
            // arrange
            const path = "/packages/alpha";
            const expected = {
                name: "alpha",
                version: "1.0.0",
            };
            fs.__writeJson(`${path}/package.json`, expected);

            const pkg = new Package(path);

            // act
            const actual = await pkg.getDescriptor();

            // assert
            expect(actual).toEqual(expected);
        });

        it("should reject when package descriptor does not exist", () => {
            // arrange
            const path = "/packages/alpha";
            const pkg = new Package(path);

            // act
            const promise = pkg.getDescriptor();

            // assert
            expect(promise).rejects.toThrow(`File does not exist. (${path}/package.json)`);
        });

    });

});

afterEach(() => {
    fs.__clear();
});
