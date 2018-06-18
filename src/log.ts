export interface Log {
    write(message: string): void;
    error(message: string): void;
}

export class ConsoleLog implements Log {

    error(message: string): void {
        throw new Error("Method not implemented.");
    }

    write(message: string): void {
        // tslint:disable-next-line:no-console
        console.log(message);
    }
    
}
