import * as vscode from 'vscode';
import { ProcessManager } from '../process-manager/process-manager';
import { Process } from '../process-manager';

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

      const processManager = await ProcessManager.forOS();

      panel.webview.onDidReceiveMessage(message => {
        switch (message.command) {
          case 'refresh':

          case 'kill':
            vscode.window.showErrorMessage('This is a test');
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
            <td>${process.pid} </td>
            <td>  ${process.name} </td>
            <td> ${process.localAddress} </td>
            <td>  ${process.foreignAddress} </td>
            <td>${process.state}</td>
            <td><a class="kill-btn" href="#" onclick="onKillTask()">Kill task</a></td>
          </tr>`;
        })}
      </tbody>
    </table>

      <script>
        function onKillTask(process) {
          vscode.postMessage({
            command: 'kill'
          });
        };
      </script>
    </body>
    </html>`;
}
