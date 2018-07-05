#!/usr/bin/env node
import { DefaultCommandExecutor } from "./command";
import { PackagesCommand, RunCommand } from "./commands";
import * as Constants from "./constants";
import { ConsoleLog } from "./log";
import { DefaultRepository } from "./repository";
import { DefaultScriptRunner } from "./script-runner";
import { DefaultServiceProvider } from "./service";

// tslint:disable-next-line:no-var-requires
require("console.table");

const cwd = process.cwd();
const params = process.argv.slice(2);

const services = new DefaultServiceProvider()
    .addFactory(Constants.Repository, (serviceProvider) => new DefaultRepository(serviceProvider, cwd))
    .addType(Constants.ScriptRunner, DefaultScriptRunner)
    .addType(Constants.Log, ConsoleLog);

const executor = new DefaultCommandExecutor(
    services,
    PackagesCommand,
    RunCommand,
);

executor.exec(...params)
    .then(() => true)
    .catch((err) => {
        // tslint:disable-next-line:no-console
        console.log(err);
    });
