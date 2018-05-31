import { basename } from 'path';

const fs: any = jest.genMockFromModule('fs');

type CallbackFunc<T> = (this: void, err: Error | null, result: T) => void;

enum EntryKind {
    directory,
    file,
    link
}

interface Entry {
    readonly kind: EntryKind;
    readonly path: string;
    [key: string]: any;
}

class Stats {

    constructor(readonly entry: Entry) { }

    isDirectory = () => this.entry.kind == EntryKind.directory;

}

let entries: Entry[] = [];

function __clear() {
   entries = []; 
}

function __mkdir(path: string) {
    entries.push({
        kind: EntryKind.directory,
        path
    });
}

function __writeFile(path: string, content = '') {
    entries.push({
        kind: EntryKind.file,
        path,
        content
    });
}

function __writeJson(path: string, data: object) {
    entries.push({
        kind: EntryKind.file,
        path,
        data,
        content: JSON.stringify(data)
    });
}

function readdir(path: string, callback: CallbackFunc<string[] | null>) {
    const searchResult = entries
        .filter(e => e.path.startsWith(`${path}/`))
        .map(e => basename(e.path));
    
    if (!searchResult.length) {
        callback(new Error('Directory does not exist.'), []);
    }

    callback(null, searchResult);
}

function readFile(path: string, encoding: string, callback: CallbackFunc<string>) {
    const entry = entries
        .filter(e => e.path === path)
        .shift();

    if (entry && entry.kind === EntryKind.file) callback(null, entry.content);
    else callback(new Error(`File does not exist. (${path})`), '');
}

function stat(path: string, callback: CallbackFunc<Stats | null>) {
    const entry = entries
        .filter(e => e.path === path)
        .shift();

    if (entry) callback(null, new Stats(entry));
    else callback(new Error(`File or directory does not exist. (${path})`), null);
}

fs.__clear = __clear;
fs.__mkdir = __mkdir;
fs.__writeFile = __writeFile;
fs.__writeJson = __writeJson;
fs.readdir = readdir;
fs.readFile = readFile;
fs.stat = stat;
module.exports = fs;