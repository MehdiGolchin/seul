#!/usr/bin/env node

import { CommandExecutor } from "./command";

const params = process.argv.slice(2);

const executor = new CommandExecutor();
const exist = executor.exec(...params)