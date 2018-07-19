import * as constants from "../src/constants";
import { FileScript } from "../src/file-scripts";
import { InMemoryLog } from "../src/log";
import Package from "../src/package";
import { DefaultServiceProvider } from "../src/service";

describe("FileScript", () => {

    describe("exec", () => {

        test("should execute a script file", async () => {
            // arrange
            const services = new DefaultServiceProvider()
                .addType(constants.log, InMemoryLog);
            const file = new FileScript(services, "./tests/scripts/hello.js");
            const currentPackage = new Package(process.cwd());

            // act
            await file.exec(currentPackage);

            // assert
            const log = services.getService<InMemoryLog>(constants.log);
            expect(log.info).toEqual(["hello!"]);
        });

    });

});
