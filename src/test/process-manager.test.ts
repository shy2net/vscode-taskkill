import {
  ProcessManager,
  getProcessManagerForOS
} from '../process-manager';

getProcessManagerForOS().then(procManager => {
  procManager.getProcesses().then(result => {
    console.log(result);
  });
});
