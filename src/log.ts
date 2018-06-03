export interface Log {
    write(message: string): void;
}

export class ConsoleLog implements Log {
    write(message: string): void {
        // tslint:disable-next-line:no-console
        console.log(message);
    }
}
