// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as showActiveNetworkTasks from './commands/showActiveNetworkTasks.command';

export function activate(context: vscode.ExtensionContext) {
  // Register all VSCode extension commands
  context.subscriptions.push(showActiveNetworkTasks.registerCommand());
}

// this method is called when your extension is deactivated
export function deactivate() {}
