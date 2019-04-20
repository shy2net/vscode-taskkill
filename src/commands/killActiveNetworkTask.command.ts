import * as vscode from 'vscode';

import { ProcessManager } from '../process-manager';

/**
 * A command while kills a specific network process by it's port number.
 */
export class KillActiveNetworkTaskCommand {
  constructor(private processManager: ProcessManager) {}

  register() {
    return vscode.commands.registerCommand(
      'extension.killActiveNetworkTask',
      async () => {
        const input = await vscode.window.showInputBox({
          placeHolder: `Please enter the network port of the process you would like to kill`,
          validateInput: value => {
            if (!value || isNaN(value as any))
              return 'Value must be a port number!';

            return null;
          }
        });

        if (input) {
          const portNumber = parseInt(input);
          const processes = await this.processManager.getProcesses();
          const foundProcess = processes.find(
            proc => this.processManager.getProcessPort(proc) === portNumber
          );

          if (foundProcess) {
            return this.processManager
              .killProcess(foundProcess.pid)
              .then(result => {
                vscode.window.showInformationMessage(
                  `Succesfully killed process ${
                    foundProcess.name
                  } which was active on port ${portNumber}!`
                );
              })
              .catch(error => {
                vscode.window.showErrorMessage(
                  `Failed to kill process ${foundProcess.name}, with pid: ${
                    foundProcess.pid
                  }: ${error}`
                );
              });
          } else {
            vscode.window.showErrorMessage(
              `There is no process listening on ${portNumber}!`
            );
          }
        }
      }
    );
  }
}
