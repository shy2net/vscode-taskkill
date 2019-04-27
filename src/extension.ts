// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { ForceKillActiveNetworkTasksCommand } from './commands/forceKillActiveNetworkTasks.command';
import { KillActiveNetworkTaskCommand } from './commands/killActiveNetworkTask.command';
import { ShowActiveNetworkTasksCommand } from './commands/showActiveNetworkTasks.command';
import { getProcessManagerForOS } from './process-manager';

export function activate(context: vscode.ExtensionContext) {
  // First get the process manager responsible of handling all of the processes
  getProcessManagerForOS()
    .then(procManager => {
      // Register all VSCode extension commands
      let command: any = new ShowActiveNetworkTasksCommand(context, procManager);
      context.subscriptions.push(command.register());

      command = new ForceKillActiveNetworkTasksCommand(procManager);
      context.subscriptions.push(command.register());

      command = new KillActiveNetworkTaskCommand(procManager);
      context.subscriptions.push(command.register());
    })
    .catch(error => {
      vscode.window.showErrorMessage(`Failed to initialize vscode-taskkill with error: ${error}`);
    });
}

// this method is called when your extension is deactivated
export function deactivate() {}
