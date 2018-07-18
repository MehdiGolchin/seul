#!/usr/bin/env node
import { DefaultCommandExecutor } from "./command";
import { PackagesCommand, RunCommand } from "./commands";
import * as constants from "./constants";
import { ConsoleLog } from "./log";
import { DefaultRepository } from "./repository";
import { DefaultScriptParser } from "./script-parser";
import { DefaultScriptRunner } from "./script-runner";
import { DefaultServiceProvider } from "./service";

// tslint:disable-next-line:no-var-requires
require("console.table");

const cwd = process.cwd();
const params = process.argv.slice(2);

const services = new DefaultServiceProvider()
    .addType(constants.log, ConsoleLog)
    .addFactory(constants.repository, (sp) => new DefaultRepository(sp, cwd))
    .addType(constants.scriptParser, DefaultScriptParser)
    .addType(constants.scriptRunner, DefaultScriptRunner);

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
