import * as shell from 'shelljs';

import { Process } from './process';
import { ProcessManager } from './process-manager';

export class WindowsProcessManager extends ProcessManager {
  constructor() {
    super();
  }

  getProcesses(): Promise<Process[]> {
    const result = shell.exec('netstat -aon');

    // Find the table start
    const headerRegex = /Proto\s+Local Address\s+Foreign Address\s+State\s+PID/gi.exec(
      result
    ) as RegExpExecArray;

    // Get the table string only by removing useless string
    const headlessResult = result
      .substring(headerRegex.index + headerRegex[0].length + 1)
      .trim();
    const entryRows = headlessResult.split(`\n`);

    // Go through each line and map it's output into a process
    const processes = entryRows.map(row => {
      const rowData = row.match(/([^\s]+)/gi) as RegExpMatchArray;

      return {
        protocol: rowData[0],
        localAddress: rowData[1],
        foreignAddress: rowData[2],
        state: rowData[3],
        pid: parseInt(rowData[4])
      } as Process;
    });

    return Promise.resolve(processes);
  }

  killProcess(pid: number): Promise<boolean> {
    const result = shell.exec(`taskkill -f -pid ${pid}`);
    if (shell.error) return Promise.reject(shell.error);
    return this.isProcessLive(pid);
  }
}
