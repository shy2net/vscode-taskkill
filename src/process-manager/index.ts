import * as getos from 'getos';

import { LinuxProcessManager } from './linux.process-manager';
import { ProcessManager } from './process-manager';
import { WindowsProcessManager } from './windows.process-manager';

export { ProcessManager } from './process-manager';
export { Process } from './process';
export { WindowsProcessManager } from './windows.process-manager';

/**
 * Returns a process manager according to the environment we are running on.
 */
export function getProcessManagerForOS(): Promise<ProcessManager> {
  return new Promise((resolve, reject) => {
    getos((error, result) => {
      if (error) return reject(error);

      switch (result.os) {
        case 'win32':
          return resolve(new WindowsProcessManager());
        case 'darwin':
          return resolve(new LinuxProcessManager());
        case 'linux':
          return resolve(new LinuxProcessManager());
      }

      return Promise.reject(new Error(`This operating system is not supported!`));
    });
  });
}
