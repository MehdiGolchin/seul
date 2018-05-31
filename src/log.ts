export interface Log {
    write(message: string): void
}

export class ConsoleLog implements Log {

    write(message: string): void {
        console.log(message);
    }
    
}