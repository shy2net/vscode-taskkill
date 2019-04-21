import * as shell from 'shelljs';

import { Process } from './process';
import { ProcessManager } from './process-manager';

export class MacProcessManager extends ProcessManager {
  getProcesses(): Promise<Process[]> {
    const processes = this.getLsofProcesses();

    return Promise.resolve(processes);
  }

  private getLsofProcesses(): Process[] {
    const result = shell.exec(`lsof -i -n -P`);
    const entryRows = result.split(`\n`).splice(2); // Remove the headers

    // Go through each line and map it's output into a process
    const processes = entryRows
      .filter(row => !!row) // Filter out all empty rows
      .map(row => {
        const rowData = row.match(/([^\s]+)/gi) as RegExpMatchArray;

        // If this is a process with no state, we should treat it differently
        if (rowData.length < 5) {
          return {
            protocol: rowData[0],
            localAddress: rowData[1],
            foreignAddress: rowData[2],
            pid: parseInt(rowData[3])
          } as Process;
        }

        return {
          protocol: rowData[0],
          localAddress: rowData[1],
          foreignAddress: rowData[2],
          state: rowData[3],
          pid: parseInt(rowData[4])
        } as Process;
      });

    return processes;
  }

  killProcess(pid: number): Promise<boolean> {
    shell.exec(`kill -9 ${pid}`);
    const error = shell.error();
    if (error) return Promise.reject(error);
    return this.isProcessLive(pid).then(result => !result);
  }
}
