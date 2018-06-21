export interface Log {
    write(message: string): void;
    error(message: string): void;
}

export class ConsoleLog implements Log {

    error(message: string): void {
        // tslint:disable-next-line:no-console
        console.log(message);
    }

    write(message: string): void {
        // tslint:disable-next-line:no-console
        console.log(message);
    }

}

// tslint:disable-next-line:max-classes-per-file
export class InMemoryLog implements Log {

    readonly info: string[] = [];
    readonly errors: string[] = [];

    write(message: string): void {
        this.info.push(message);
    }

    error(message: string): void {
        this.errors.push(message);
    }

}
