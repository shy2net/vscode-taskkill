import * as shell from 'shelljs';

const tableParser = require('table-parser');

import { Process } from './process';
import { ProcessManager } from './process-manager';

export class WindowsProcessManager implements ProcessManager {
  getProcesses(): Promise<Process[]> {
    const result = shell.exec('netstat -aon');

    const parsedTable = tableParser.parse(result);

    return Promise.resolve([]);
  }
  killProcess(process: Process): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  isProcessLive(process: Process): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
