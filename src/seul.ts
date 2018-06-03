#!/usr/bin/env node

import { DefaultCommandExecutor } from "./command";
import { PackagesCommand } from "./commands/packages-command";
import { ConsoleLog } from "./log";
import { DefaultRepository } from "./repository";

const cwd = process.cwd();
const params = process.argv.slice(2);

const executor = new DefaultCommandExecutor(
    new DefaultRepository(cwd),
    new ConsoleLog(),
    PackagesCommand,
);

executor.exec(...params)
    .then(() => true)
    .catch((err) => {
        // tslint:disable-next-line:no-console
        console.log(err);
    });
