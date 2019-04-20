import * as vscode from 'vscode';

import {
  Process,
  ProcessManager
} from '../process-manager';

export class ShowActiveNetworkTasksCommand {
  panel!: vscode.WebviewPanel;
  constructor(private processManager: ProcessManager) {}

  register() {
    return vscode.commands.registerCommand(
      'extension.showActiveNetworkTasks',
      async () => {
        // Create our task management panel
        const panel = vscode.window.createWebviewPanel(
          'activeTasks',
          'Active tasks',
          vscode.ViewColumn.One,
          { enableScripts: true }
        );

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
      }
    );
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

            vscode.window.showErrorMessage(
              `Failed to kill process with pid ${message.pid}!`
            );
          })
          .catch(err => {
            vscode.window.showErrorMessage(
              `Failed to kill process with pid ${message.pid}, error: ${err}`
            );
          });
    }
  }

  getWebViewContent(processes: Process[]) {
    return `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Active Network Tasks</title>
      </head>
      <body>
        <table class="table">
        <thead>
          <tr>
            <th scope="col">PID</th>
            <th scope="col">Name</th>
            <th scope="col">Local Address</th>
            <th scope="col">Foreign Address</th>
            <th scope="col">State</th>
            <th scope="col">Functions</th>
          </tr>
        </thead>
        <tbody>
          ${processes.map(process => {
            return `
            <tr id="pid_${process.pid}">
              <td>${process.pid}</td>
              <td>${process.name}</td>
              <td>${process.localAddress}</td>
              <td>${process.foreignAddress}</td>
              <td>${process.state}</td>
              <td><a href="#" onclick="onKillTask(${
                process.pid
              })" class="kill-btn">Kill task</a></td>
            </tr>`;
          })}
        </tbody>
      </table>
  
        <script>
          const vscode = acquireVsCodeApi();
  
          window.addEventListener('message', event => {
  
            const message = event.data;
  
            switch (message.command) {
                case 'task_killed':
                    // Remove the entry as the task was killed
                    document.querySelector('#pid_' + message.pid).remove();
                    break;
            }
          });
  
          function onKillTask(pid) {
            vscode.postMessage({
              command: 'kill',
              pid
            });
          };
        </script>
      </body>
      </html>`;
  }
}
