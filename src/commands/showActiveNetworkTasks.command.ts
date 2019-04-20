import * as vscode from 'vscode';
import {
  Process,
  ProcessManager,
  getProcessManagerForOS
} from '../process-manager';

export function registerCommand() {
  return vscode.commands.registerCommand(
    'extension.showActiveNetworkTasks',
    async () => {
      const panel = vscode.window.createWebviewPanel(
        'activeTasks',
        'Active tasks',
        vscode.ViewColumn.One,
        { enableScripts: true }
      );

      const processManager = await getProcessManagerForOS();

      panel.webview.onDidReceiveMessage(message => {
        switch (message.command) {
          case 'refresh':

          case 'kill':
            processManager
              .killProcess(message.pid as number)
              .then(result => {
                if (result)
                  return vscode.window.showInformationMessage(
                    `Succesfully killed process with pid: ${message.pid}`
                  );

                vscode.window.showErrorMessage(
                  `Failed to kill process with pid ${message.pid}!`
                );
              })
              .catch(err => {
                vscode.window.showErrorMessage(
                  `Failed to kill process with pid ${
                    message.pid
                  }, error: ${err}`
                );
              });
        }
      });

      panel.webview.html = await getWebViewContent(
        await processManager.getProcesses()
      );
    }
  );
}

async function getWebViewContent(processes: Process[]) {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cat Coding</title>
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
          <th scope="Kill task"></th>
        </tr>
      </thead>
      <tbody>
        ${processes.map(process => {
          return `
          <tr>
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
