import * as vscode from 'vscode';

import { ProcessManager } from '../process-manager';

/**
 * A command which kills all interesting active network processes running in the background.
 */
export class ForceKillActiveNetworkTasksCommand {
  constructor(private processManager: ProcessManager) {}

  register() {
    return vscode.commands.registerCommand(
      'extension.forceKillActiveNetworkTasks',
      async () => {
        const processes = await this.processManager.getProcesses();
        const interestingProcesses = this.processManager
          .getMarkedProcesses(processes)
          .filter(proc => proc.interesting)
          .map(proc => proc.process);

        if (interestingProcesses.length === 0)
          return vscode.window.showInformationMessage(
            `No active network processes were found!`
          );

        const killPromises = interestingProcesses.map(proc =>
          this.processManager.killProcess(proc.pid)
        );

        Promise.all(killPromises)
          .then(results => {
            vscode.window.showInformationMessage(
              `All active network processes were killed (${results.length})!`
            );
          })
          .catch(error => {
            vscode.window.showErrorMessage(
              `Some processes couldn't be killed: ${error}`
            );
          });
      }
    );
  }
}
