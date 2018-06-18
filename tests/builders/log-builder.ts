import { Log } from "../../src/log";

export type LogFunc = (message: string) => void;

export const DefaultLogFunc: LogFunc = () => true;

export class LogBuilder {

    private write: LogFunc = DefaultLogFunc;
    private error: LogFunc = DefaultLogFunc;

    setWrite(fn: LogFunc) {
        this.write = fn;
        return this;
    }

    setError(fn: LogFunc) {
        this.error = fn;
        return this;
    }

    build(): Log {
        const log: Log = {
            write: this.write,
            error: this.error,
        };

        return log;
    }

}
