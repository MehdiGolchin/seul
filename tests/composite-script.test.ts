import CompositeScript from "../src/composite-script";
import * as Constants from "../src/constants";
import Log, { InMemoryLog } from "../src/log";
import Package from "../src/package";
import { Script } from "../src/script-parser";
import ServiceProvider, { DefaultServiceProvider } from "../src/service";

describe("CompositeScript", () => {

    describe("exec", () => {

        test("should execute all the scripts", async () => {
            // arrange
            const services = new DefaultServiceProvider()
                .addType(Constants.Log, InMemoryLog);

            const scripts = new CompositeScript(services, [
                new DummyScript(services, "first"),
                new DummyScript(services, "second"),
                new DummyScript(services, "third")
            ]);

            const currentPackage = new Package("/myrepo/packages/mypkg");

            // act
            await scripts.exec(currentPackage);

            // assert
            const log = services.getService<InMemoryLog>(Constants.Log);
            expect(log.info).toEqual(["first", "second", "third"]);
        });

        test("should not continue execution on error", async () => {
            // arrange
            const services = new DefaultServiceProvider()
                .addType(Constants.Log, InMemoryLog);

            const errorMessage = "Something went wrong!";

            const scripts = new CompositeScript(services, [
                new DummyScript(services, "first"),
                new DummyScript(services, new Error(errorMessage)),
                new DummyScript(services, "third")
            ]);

            const currentPackage = new Package("/myrepo/packages/mypkg");

            // act
            let error: Error | null = null;
            try {
                await scripts.exec(currentPackage);
            } catch (ex) {
                error = ex;
            }

            // assert
            const log = services.getService<InMemoryLog>(Constants.Log);
            expect(error.message).toEqual(errorMessage);
            expect(log.info).toEqual(["first"]);
        });

        test("should not continue execution on error", async () => {
            // arrange
            const services = new DefaultServiceProvider()
                .addType(Constants.Log, InMemoryLog);

            const errorMessage = "Something went wrong!";

            const scripts = new CompositeScript(services, [
                new DummyScript(services, "first"),
                new DummyScript(services, new Error(errorMessage)),
                new DummyScript(services, "third")
            ], true);

            const currentPackage = new Package("/myrepo/packages/mypkg");

            // act
            await scripts.exec(currentPackage);

            // assert
            const log = services.getService<InMemoryLog>(Constants.Log);
            expect(log.info).toEqual(["first", "third"]);
        });

    });

});

class DummyScript implements Script {

    constructor(readonly services: ServiceProvider, readonly messageOrError: string | Error) { }

    exec(currentPackage: Package): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (typeof this.messageOrError === "string") {
                const log = this.services.getService<Log>(Constants.Log);
                log.write(this.messageOrError);
                resolve();
            } else {
                reject(this.messageOrError);
            }
        });
    }

}
