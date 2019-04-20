import * as vscode from 'vscode';

export function registerCommand() {
  return vscode.commands.registerCommand(
    'extension.showActiveNetworkTasks',
    () => {
      // Display a message box to the user
      vscode.window.showInformationMessage('Hello World!');

      const panel = vscode.window.createWebviewPanel(
        'activeTasks',
        'Active tasks',
        vscode.ViewColumn.One,
        {}
      );

      panel.webview.html = getWebViewContent();
    }
  );
}

function getWebViewContent() {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cat Coding</title>
    </head>
    <body>
    <h6>Nice thing</h6>
    </body>
    </html>`;
}
