jest.mock("fs");
// tslint:disable-next-line:no-var-requires
const fs = require("fs");

import { Package } from "../src/package";

describe("Package", () => {

    describe("getDescriptor", () => {

        test("should return package descriptor", async () => {
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

        test("should reject when package descriptor does not exist", async () => {
            // arrange
            const path = "/packages/alpha";
            const pkg = new Package(path);

            // act
            let error: Error | null;
            try {
                await pkg.getDescriptor();
            } catch (ex) {
                error = ex;
            }

            // assert
            expect(error).toEqual(new Error(`File does not exist. (${path}/package.json)`));
        });

    });

});

afterEach(fs.__clear);
