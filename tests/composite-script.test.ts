import { CompositeScript } from "../src/composite-script";
import * as Constants from "../src/constants";
import { InMemoryLog, Log } from "../src/log";
import { Package } from "../src/package";
import { Script } from "../src/script-parser";
import { DefaultServiceProvider, ServiceProvider } from "../src/service";

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

    });

});

class DummyScript implements Script {

    constructor(readonly services: ServiceProvider, readonly name: string) { }

    exec(currentPackage: Package): Promise<any> {
        return new Promise<any>((resolve) => {
            const log = this.services.getService<Log>(Constants.Log);
            log.write(this.name);
            resolve();
        });
    }

}
