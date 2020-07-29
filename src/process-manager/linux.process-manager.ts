import { exec } from '../utils';
import { Process } from './process';
import { ProcessManager } from './process-manager';

export class LinuxProcessManager extends ProcessManager {
  getProcesses(): Promise<Process[]> {
    const processes = this.getLsofProcesses();

    return Promise.resolve(processes);
  }

  private getLsofProcesses(): Process[] {
    const result = exec(`lsof -i -n -P`);
    const entryRows = result.split(`\n`).splice(1) as string[]; // Remove the headers

    // Go through each line and map it's output into a process
    const processes = entryRows
      .filter((row) => !!row) // Filter out all empty rows
      .map((row) => {
        const rowData = row.match(/([^\s]+)/gi) as RegExpMatchArray;

        const address = rowData[8].split('->');
        const localAddress = address[0];
        const foreignAddress = address.length > 1 && address[1];

        return {
          name: rowData[0],
          pid: parseInt(rowData[1]),
          protocol: rowData[7],
          localAddress,
          foreignAddress: foreignAddress,
          state: (rowData.length > 9 && rowData[9]) || 'NOT SET',
        } as Process;
      });

    return processes;
  }

  killProcess(pid: number): Promise<boolean> {
    exec(`kill -9 ${pid}`);
    return this.isProcessLive(pid).then((result) => !result);
  }
}
