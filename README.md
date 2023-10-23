# Prettycom ![Node.js CI](https://github.com/hyldmo/prettycom/workflows/Node.js%20CI/badge.svg)
----
Inspired by [CuteCom](https://gitlab.com/cutecom/cutecom/), Prettycom is a cross-platform serial monitor written in electron.

![Screenshot](./screenshot.png)

![image](https://github.com/hyldmo/prettycom/assets/3465788/bc7be5ff-2c57-42ac-8d00-b82e8cac9bd1)

![image](https://github.com/hyldmo/prettycom/assets/3465788/a917adf3-0d80-4647-8714-27ca60ecd2d6)



## Installation
Binaries can be found [here](https://github.com/hyldmo/prettycom/releases).

## Development
- Clone repository: `git clone https://github.com/hyldmo/prettycom.git`
- Run `yarn`
- Run `yarn dev`, or if you're using VSCode, press `F5`

### Notes
- Code in `app/server` server folder lives inside electron, and is not automatically reloaded.
You will have to restart the electron shell for changes to be reflected.
- Build files (such as `.js` and `.css`) are automatically hidden in VS Code. Go to `.vscode\settings.json` to unhide them.
- If you are switching branches and you're getting errors, try running `yarn clean` to clear old build files
