import { WindowsProcessManager } from '../process-manager/windows.process-manager';

const procManager = new WindowsProcessManager();

procManager.getProcesses().then(result => {
    console.log(result);
});