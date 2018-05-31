#!/usr/bin/env node

import { DefaultCommandExecutor } from "./command";
import { DefaultRepository } from "./repository";
import { ConsoleLog } from "./log";
import { PackagesCommand } from "./commands/packages-command";

const cwd = process.cwd();
const params = process.argv.slice(2);

const executor = new DefaultCommandExecutor(
    new DefaultRepository(cwd), 
    new ConsoleLog(), 
    PackagesCommand
);

executor.exec(...params).then(() => {

}).catch(err => {
    console.log(err);
});