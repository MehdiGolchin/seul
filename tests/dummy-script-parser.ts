import { Script, ScriptParser } from "../src/script-parser";
import { ServiceProvider } from "../src/service";

export class DummyScriptParser implements ScriptParser {

    private rules: { [command: string]: Script } = {};

    constructor(readonly services: ServiceProvider) { }

    parse(command: string): Promise<Script> {
        return new Promise((resolve, reject) => {
            const rule = this.rules[command];
            if (!rule) {
                return reject(rule);
            }
            return resolve(rule);
        });
    }

    addRule(command: string, fn: () => Promise<any>): DummyScriptParser {
        this.rules[command] = {
            services: this.services,
            exec: fn
        };
        return this;
    }

}
