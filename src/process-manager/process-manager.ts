import { Process } from './process';

export abstract class ProcessManager {
  constructor() {}

  abstract getProcesses(): Promise<Process[]>;

  abstract killProcess(process: Process): Promise<boolean>;

  abstract isProcessLive(process: Process): Promise<boolean>;
}
