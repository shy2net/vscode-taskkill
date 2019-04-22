import * as vscode from 'vscode';

import { Process } from './process';

/**
 * The process manager is responsible of fetching all running processes and managing them.
 */
export abstract class ProcessManager {
  constructor() {}

  /**
   * Gets all of the processes currently running.
   */
  abstract getProcesses(): Promise<Process[]>;

  /**
   * Kills a process with the specified PID.
   * @param pid
   */
  abstract killProcess(pid: number): Promise<boolean>;

  /**
   * Returns true if a process is still alive.
   * @param pid
   */
  isProcessLive(pid: number): Promise<boolean> {
    return this.getProcesses().then(processes => {
      return !!processes.find(p => p.pid === pid);
    });
  }

  getProcessPort(process: Process): number {
    return parseInt(process.localAddress.split(':')[1]);
  }

  isInterestingProcess(process: Process): boolean {
    const interestingPorts = vscode.workspace
      .getConfiguration('taskkill')
      .get('interestingPorts') as number[];

    return interestingPorts.includes(this.getProcessPort(process));
  }

  /**
   * Returns all of the processes with a mark of 'interesting' or not. Interesting is determined by the port of each process.
   * @param processes
   */
  getMarkedProcesses(processes: Process[]): { process: Process; interesting: boolean }[] {
    return processes.map(process => {
      return {
        process,
        interesting: this.isInterestingProcess(process)
      };
    });
  }

  /**
   * Returns all of the processes ordered by interesting ones first.
   */
  getOrderedProcesses(processes: Process[]): Process[] {
    const markedProcesses = this.getMarkedProcesses(processes);

    return markedProcesses
      .sort((a, b) => {
        if (a.interesting && !b.interesting) return -1;
        return 0;
      })
      .map(p => p.process);
  }
}
