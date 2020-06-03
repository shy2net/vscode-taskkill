import { exec } from '../utils';
import { Process } from './process';
import { ProcessManager } from './process-manager';

export class WindowsProcessManager extends ProcessManager {
  getProcesses(): Promise<Process[]> {
    const processes = this.getNetstatProcesses();
    this.attachProcessNamesFromTasklist(processes);

    return Promise.resolve(processes);
  }

  killProcess(pid: number): Promise<boolean> {
    exec(`taskkill -f -pid ${pid}`);
    return this.isProcessLive(pid).then((result) => !result);
  }

  private getNetstatProcesses(): Process[] {
    const result = exec('netstat -aon');
    const entryRows = result.split(`\n`).splice(4); // Remove the headers

    // Go through each line and map it's output into a process
    const processes = entryRows
      .filter((row) => !!row) // Filter out all empty rows
      .map((row) => {
        const rowData = row.match(/([^\s]+)/gi) as RegExpMatchArray;

        // If this is a process with no state, we should treat it differently
        if (rowData.length < 5) {
          return {
            protocol: rowData[0],
            localAddress: rowData[1],
            foreignAddress: rowData[2],
            pid: parseInt(rowData[3]),
          } as Process;
        }

        return {
          protocol: rowData[0],
          localAddress: rowData[1],
          foreignAddress: rowData[2],
          state: rowData[3],
          pid: parseInt(rowData[4]),
        } as Process;
      });

    return processes;
  }

  private attachProcessNamesFromTasklist(processes: Process[]) {
    // As this output does not contain any process name, we pull it using a different command
    const result = exec('tasklist').toString();

    const entries = result.split('\n').splice(3);
    const taskList = entries
      .filter((row) => !!row)
      .map((row) => {
        const rowData = row.match(/([^\s]+)/gi) as RegExpMatchArray;
        return {
          name: rowData[0],
          pid: parseInt(rowData[1]),
        };
      }) as { name: string; pid: number }[];

    // Fill all of the processes with their names
    processes.forEach((proc) => {
      const foundTask = taskList.find((task) => task.pid === proc.pid);
      if (foundTask) proc.name = foundTask.name;
    });
  }
}
