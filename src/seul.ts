#!/usr/bin/env node
import { DefaultCommandExecutor } from "./command";
import { PackagesCommand } from "./commands/packages-command";
import { ConsoleLog, Log } from "./log";
import { DefaultRepository } from "./repository";
import { DefaultScriptRunner } from "./script";
import { DefaultServiceProvider, ServiceProvider } from "./service";

const cwd = process.cwd();
const params = process.argv.slice(2);

const services = new DefaultServiceProvider()
    .addSingleton("repository", new DefaultRepository(cwd))
    .addSingleton("log", new ConsoleLog())
    .addSingleton("script",
        (provider: ServiceProvider) => new DefaultScriptRunner(provider.getService<Log>("log")),
    );

const executor = new DefaultCommandExecutor(
    services,
    PackagesCommand,
);

executor.exec(...params)
    .then(() => true)
    .catch((err) => {
        // tslint:disable-next-line:no-console
        console.log(err);
    });
