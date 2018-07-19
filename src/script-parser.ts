import CommandScript from "./command-script";
import CompositeScript from "./composite-script";
import * as constants from "./constants";
import { FileScript } from "./file-scripts";
import Package from "./package";
import Repository, { RepositoryDescriptor } from "./repository";
import ServiceProvider from "./service";

export interface Script {
    readonly services: ServiceProvider;
    exec(currentPackage: Package): Promise<any>;
}

export default interface ScriptParser {
    readonly services: ServiceProvider;
    parse(command: string): Promise<Script>;
}

export class DefaultScriptParser implements ScriptParser {

    constructor(readonly services: ServiceProvider) { }

    async parse(command: string): Promise<Script> {
        const repository = this.services.getService<Repository>(constants.repository);
        const descriptor = await repository.getDescriptor();

        if (!descriptor.scripts) {
            return new CommandScript(this.services, command);
        }

        return this.parseGroup(command, descriptor);
    }

    private parseGroup(command: string, descriptor: RepositoryDescriptor, errorOnNotFound = false): Script {
        const scripts = descriptor.scripts![command];
        if (!scripts) {
            if (errorOnNotFound) {
                throw new Error(`'${command}' script not found.`);
            }
            return new CommandScript(this.services, command);
        }
        return this.parseScripts(command, scripts, descriptor);
    }

    private parseScripts(group: string, scripts: string | string[], descriptor: RepositoryDescriptor): Script {
        const continueOnError = descriptor.continueOnError
            ? descriptor.continueOnError.indexOf(group) > -1
            : false;
        if (Array.isArray(scripts)) {
            return new CompositeScript(
                this.services,
                scripts.map((script) => this.parseScripts(group, script, descriptor)),
                continueOnError
            );
        } else if (scripts.startsWith("@exec")) {
            return new FileScript(this.services, scripts.substr(5).trim());
        } else if (scripts.startsWith("@")) {
            return this.parseGroup(scripts.substr(1), descriptor, true);
        }
        return new CommandScript(this.services, scripts);
    }

}
