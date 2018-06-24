export interface Log {
    write(message: string): void;
    error(message: string): void;
    table(data: any[]): void;
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

    table(data: any[]): void {
        // tslint:disable-next-line:no-console
        console.table(data);
    }

}

// tslint:disable-next-line:max-classes-per-file
export class InMemoryLog implements Log {

    readonly info: string[] = [];
    readonly errors: string[] = [];
    readonly data: any[] = [];

    write(message: string): void {
        this.info.push(message);
    }

    error(message: string): void {
        this.errors.push(message);
    }

    table(data: any[]): void {
        this.data.push(data);
    }

}
