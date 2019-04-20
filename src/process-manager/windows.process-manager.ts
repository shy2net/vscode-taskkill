import * as shell from 'shelljs';

import { Process } from './process';
import { ProcessManager } from './process-manager';

export class WindowsProcessManager implements ProcessManager {
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

  killProcess(process: Process): Promise<boolean> {
    const result = shell.exec(`taskkill -f -pid ${process.pid}`);
    return Promise.resolve(true);
  }

  isProcessLive(process: Process): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
