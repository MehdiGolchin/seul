export interface ServiceProvider {
    addFactory<T>(name: string, factory: (service: ServiceProvider) => T): ServiceProvider;
    addType<T>(name: string, type: new (services: ServiceProvider) => T): ServiceProvider;
    addInstance<T>(name: string, service: T): ServiceProvider;
    getService<T>(name: string): T;
}

export type ServiceFactory<T = any> = (services: ServiceProvider) => T;
export type ServiceConstructor<T = any> = new (services: ServiceProvider) => T;

export interface ServiceCollection {
    [name: string]: ServiceFactory;
}

export interface ServiceCache {
    [name: string]: any;
}

export class DefaultServiceProvider implements ServiceProvider {

    private readonly services: ServiceCollection = {};
    private readonly cache: ServiceCache = {};

    addFactory<T>(name: string, factory: ServiceFactory<T>): ServiceProvider {
        this.services[name] = factory;
        return this;
    }

    addType<T>(name: string, type: ServiceConstructor<T>): ServiceProvider {
        this.services[name] = (serviceProvider) => new type(serviceProvider);
        return this;
    }

    addInstance<T>(name: string, service: T): ServiceProvider {
        this.services[name] = () => service;
        return this;
    }

    getService<T>(name: string): T {
        let service = this.cache[name];
        if (service) {
            return service as T;
        }
        const factory = this.services[name];
        if (typeof factory === "function") {
            service = factory(this);
            this.cache[name] = service;
            return service;
        }
        throw new Error(`'${name}' service not found.`);
    }

}
