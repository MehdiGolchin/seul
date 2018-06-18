jest.mock("child_process");
// tslint:disable-next-line:no-var-requires
const cp = require("child_process");

export function setupChildProcess(commands: { [command: string]: { stdout: string, stderr: string } | Error }) {
    cp.__implementExec(
        (
            cmd: string,
            opt = {},
            cb: (err: Error, stdout: string, stderr: string) => void,
        ) => {
            const result = commands[cmd];
            if (result instanceof Error) {
                cb(result, null, null);
            } else {
                cb(null, result.stdout, result.stderr);
            }
        },
    );
}
