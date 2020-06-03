import * as childProcess from 'child_process';

export function exec(command: string): string {
    const result = childProcess.execSync(command);
    return result.toString();
}
