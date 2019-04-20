import * as getos from 'getos';

import { Process } from './process';
import { WindowsProcessManager } from './windows.process-manager';

export abstract class ProcessManager {
  constructor() {}

  abstract getProcesses(): Promise<Process[]>;

  abstract killProcess(process: Process): Promise<boolean>;

  abstract isProcessLive(process: Process): Promise<boolean>;

  static forOS(): Promise<ProcessManager> {
    return new Promise((resolve, reject) => {
      getos((error, result) => {
        if (error) return reject(error);

        switch (result.os) {
          case 'win32':
            return resolve(new WindowsProcessManager());
        }

        return Promise.reject(
          new Error(`This operating system is not supported!`)
        );
      });
    });
  }
}
