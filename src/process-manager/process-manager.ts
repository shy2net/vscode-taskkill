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
}
