import { ProcessManager } from '../process-manager/process-manager';

ProcessManager.forOS().then(procManager => {
  procManager.getProcesses().then(result => {
    console.log(result);
  });
});
