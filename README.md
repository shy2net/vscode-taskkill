## Features

This extension allows you to easily kill active network processes on a specific port.

- Kill all interesting active network processes (such as 8000, 4200, 3000 for NodeJS and Angular)
- Show and kill specific active network processes manually
- Kill a specific network process by specifying a port number

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Usage

### Killing a specific active network process
1. Open up the prompt (F1 \Ctrl+Shift+P \ CMD+Shift+P) and select\type
'Kill an active network task (by port number)'.
2. Type in the port number of the process you want to kill.
3. Hit enter.


### Kill all interesting active network processes
1. Open up the prompt (F1 \Ctrl+Shift+P \ CMD+Shift+P) and select\type
'Kill all active network tasks'.


### Show all active network processes
1. Open up the prompt (F1 \Ctrl+Shift+P \ CMD+Shift+P) and select\type
'Show active network tasks'.
2. Select the process you want to kill and hit the 'Kill task' button associated with it.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: enable/disable this extension
* `myExtension.thing`: set to `blah` to do something

## Known Issues

- This extension is currently only supported on Windows.

## Release Notes

### 0.0.3

Initial release of extension.