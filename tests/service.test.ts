import { DefaultServiceProvider, ServiceProvider } from "../src/service";

describe("ServiceProvider Class", () => {

    describe("addType", () => {

        test("should register a service type", () => {
            // arrange
            const serviceProvider = new DefaultServiceProvider();

            // act
            serviceProvider
                .addType(Greeting.serviceName, Greeting)
                .addType(Strings.serviceName, Strings);

            // assert
            const service = serviceProvider.getService<Greeting>(Greeting.serviceName);
            expect(service.sayHello("John")).toEqual("Hey John");
        });

    });

    describe("addFactory", () => {

        test("should register a service factory method", () => {
            // arrange
            const serviceProvider = new DefaultServiceProvider();

            // act
            serviceProvider
                .addFactory(Greeting.serviceName, (services) => new Greeting(services))
                .addType(Strings.serviceName, Strings);

            // assert
            const service = serviceProvider.getService<Greeting>(Greeting.serviceName);
            expect(service.sayHello("John")).toEqual("Hey John");
        });

    });

    describe("addInstance", () => {

        test("should register a service instance", () => {
            // arrange
            const serviceProvider = new DefaultServiceProvider();

            // act
            serviceProvider
                .addType(Greeting.serviceName, Greeting)
                .addInstance(Strings.serviceName, new Strings());

            // assert
            const service = serviceProvider.getService<Greeting>(Greeting.serviceName);
            expect(service.sayHello("John")).toEqual("Hey John");
        });

    });

    describe("getService", () => {

        test("should throw error when service does not exist", () => {
            // arrange
            const serviceProvider = new DefaultServiceProvider();

            // act & assert
            expect(() => {
                serviceProvider.getService<Strings>(Strings.serviceName);
            }).toThrow(`'${Strings.serviceName}' service not found.`);
        });

    });

    class Strings {
        static readonly serviceName = "Strings";
        readonly hey = "Hey";
    }

    // tslint:disable-next-line:max-classes-per-file
    class Greeting {
        static readonly serviceName = "Greeting";

        private readonly strings: Strings;

        constructor(private readonly services: ServiceProvider) {
            this.strings = services.getService<Strings>(Strings.serviceName);
        }

        sayHello = (name: string) => `${this.strings.hey} ${name}`;
    }

});
