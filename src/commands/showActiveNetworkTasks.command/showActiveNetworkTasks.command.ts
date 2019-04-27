import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { Process, ProcessManager } from '../../process-manager';

export class ShowActiveNetworkTasksCommand {
  panel!: vscode.WebviewPanel;
  constructor(private context: vscode.ExtensionContext, private processManager: ProcessManager) {}

  register() {
    return vscode.commands.registerCommand('extension.showActiveNetworkTasks', async () => {
      // Create our task management panel
      const panel = vscode.window.createWebviewPanel('activeTasks', 'Active tasks', vscode.ViewColumn.One, {
        enableScripts: true
      });

      this.panel = panel;

      const processManager = this.processManager;

      // Allow receiving messages from the webview
      panel.webview.onDidReceiveMessage(message => {
        this.handleWebviewMessage(message);
      });

      // Fetch all of the processes
      const processes = await processManager.getProcesses();

      // Order them from interesting to not interesting
      const orderedProcesses = processManager.getOrderedProcesses(processes);

      // Set the webview content with the process we obtained
      panel.webview.html = this.getWebViewContent(orderedProcesses);
    });
  }

  handleWebviewMessage(message: any) {
    switch (message.command) {
      case 'kill':
        this.processManager
          .killProcess(message.pid as number)
          .then(result => {
            if (result) {
              // The process has been successfully killed, update the GUI
              this.panel.webview.postMessage({
                command: 'task_killed',
                pid: message.pid
              });

              return vscode.window.showInformationMessage(
                `Successfully killed process with pid: ${message.pid}`
              );
            }

            vscode.window.showErrorMessage(`Failed to kill process with pid ${message.pid}!`);
          })
          .catch(err => {
            vscode.window.showErrorMessage(`Failed to kill process with pid ${message.pid}, error: ${err}`);
          });
    }
  }

  getWebViewContent(): string {
    const htmlFilePath: vscode.Uri = vscode.Uri.file(
      path.join(this.context.extensionPath, 'src/commands/showActiveNetworkTasks.command.html')
    );

    return fs.readFileSync(htmlFilePath.fsPath, 'utf8');
  }
}
