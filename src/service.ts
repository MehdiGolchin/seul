export interface ServiceProvider {
    addSingleton(name: string, service: any): ServiceProvider;
    addTransient(name: string, service: any): ServiceProvider;
    getService<T>(name: string): T;
}

export type ServiceFactory = (provider: ServiceProvider) => any;

export interface ServiceCollection {
    [name: string]: ServiceFactory | any;
}

export class DefaultServiceProvider implements ServiceProvider {

    private readonly services: ServiceCollection = {};

    addSingleton(name: string, service: any): DefaultServiceProvider {
        this.services[name] = service;
        return this;
    }

    addTransient(name: string, factory: ServiceFactory): DefaultServiceProvider {
        this.services[name] = factory;
        return this;
    }

    getService<T>(name: string): T {
        const value = this.services[name];
        if (typeof this.services[name] === "function") {
            return value(this) as T;
        }
        return value as T;
    }

}
