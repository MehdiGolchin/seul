import { DefaultServiceProvider } from "../src/service";

describe("ServiceProvider Class", () => {

    describe("addSingleton", () => {

        it("should register a singleton service", () => {
            // arrange
            const serviceName = "greeting";
            const expected = new GreetingService();
            const services = new DefaultServiceProvider();

            // act
            services.addSingleton(serviceName, expected);

            // assert
            const first = services.getService<GreetingService>(serviceName);
            const second = services.getService<GreetingService>(serviceName);
            expect(first).toBe(expected);
            expect(first).toBe(second);
        });

    });

    describe("addTransient", () => {

        it("should register a transient service", () => {
            // arrange
            const serviceName = "greeting";
            const services = new DefaultServiceProvider();

            // act
            services.addTransient(serviceName, () => new GreetingService());

            // assert
            const first = services.getService<GreetingService>(serviceName);
            const second = services.getService<GreetingService>(serviceName);
            expect(first).toBeInstanceOf(GreetingService);
            expect(second).toBeInstanceOf(GreetingService);
            expect(first).not.toEqual(second);
        });

    });

    class GreetingService {
        sayHello = (name: string) => `Hey ${name}`;
    }

});
