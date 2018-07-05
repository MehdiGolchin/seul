import { CommandScript } from "./command-script";
import { CompositeScript } from "./composite-script";
import * as Constants from "./constants";
import { Package } from "./package";
import { Repository, RepositoryDescriptor } from "./repository";
import { ServiceProvider } from "./service";

export interface Script {
    readonly services: ServiceProvider;
    exec(currentPackage: Package): Promise<any>;
}

export interface ScriptParser {
    readonly services: ServiceProvider;
    parse(command: string): Promise<Script>;
}

export class DefaultScriptParser implements ScriptParser {

    constructor(readonly services: ServiceProvider) { }

    async parse(command: string): Promise<Script> {
        const repository = this.services.getService<Repository>(Constants.Repository);
        const descriptor = await repository.getDescriptor();

        if (!descriptor.scripts) {
            return new CommandScript(this.services, command);
        }

        return this.parseGroup(command, descriptor);
    }

    private parseGroup(command: string, descriptor: RepositoryDescriptor): Script {
        const scripts = descriptor.scripts![command];
        if (!scripts) {
            return new CommandScript(this.services, command);
        }
        return this.parseScripts(scripts, descriptor);
    }

    private parseScripts(scripts: string | string[], descriptor: RepositoryDescriptor): Script {
        if (Array.isArray(scripts)) {
            return new CompositeScript(
                this.services,
                scripts.map((script) => this.parseScripts(script, descriptor)),
            );
        } else if (scripts.startsWith("@")) {
            return this.parseGroup(scripts.substr(1), descriptor);
        }
        return new CommandScript(this.services, scripts);
    }

}
