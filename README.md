## Features

This extension allows you to easily kill active network processes on a specific port.

- Kill all interesting active network processes (such as 8000, 4200, 3000 for NodeJS and Angular) automatically
- Kill a specific network process by specifying a port number (`Ctrl + Del`, on mac `Cmd + Del`)
- Show and kill specific active network processes manually (`Ctrl + Shift + Del`, on mac `Cmd + Shift + Del`).


### Killing a specific active network process

![Killing a specific active network process](/images/kill_specific_process.gif)

### Show and kill active network processes
![Show all active network processes](/images/show_active_tasks.gif)

## Usage

### Killing a specific active network process
1. Open up the prompt (`F1` \ `Ctrl+Shift+P` \ `CMD+Shift+P`) and select:
`"Task Kill: Kill an active network task (by port number)"` or simply hit `Ctrl + Del` (numpad_decimal).
2. Type in the port number of the process you want to kill.
3. Hit enter.


### Kill all interesting active network processes
1. Open up the prompt (`F1` \ `Ctrl+Shift+P` \ `CMD+Shift+P`) and select:
`"Task Kill: Kill all active network tasks"`.


### Show all active network processes
1. Open up the prompt (`F1` \ `Ctrl+Shift+P` \ `CMD+Shift+P`) and select:
`"Task Kill: Show active network tasks"` or simply hit `Ctl + Shift + Del` (numpad_decimal).
2. Select the process you want to kill and hit the `Kill task` button associated with it.

## Extension Settings

### Configurations

By default, the configured interesting ports are the following:

```json
"taskkill.interestingPorts": [3000, 4200, 8000]
```

Interesting ports are shown at the top of the task-kill table and are killed automatically using the `"Kill all active network tasks"` command.
You can simply copy the code above and edit the ports to your needs.

### Keybindings

By default this extension comes with following keybindings:
- `Ctrl + Del`  - Kill a task by it's port number.
- `Ctrl + Shift + Del` - Show active network tasks and kill them manually.

You can simply edit your own keybindings in the `keybindings.json` file:

```json
{
    "command": "extension.killActiveNetworkTask",
    "key": "ctrl+numpad_decimal",
    "mac": "cmd+numpad_decimal"
},
{
    "command": "extension.showActiveNetworkTasks",
    "key": "ctrl+delete ctrl+shift",
    "mac": "cmd+delete cmd+shift"
}
```



## Known Issues

- This extension is currently only supported on Windows and Mac.

## Release Notes

### 0.0.52
- Added icon

### 0.0.5
- Added default keybindings and custom configurations

### 0.0.4

- Added MAC support

### 0.0.3

- Initial release of extension.
