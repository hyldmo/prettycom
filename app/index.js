"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Modules to control application life and create native browser window
var electron_1 = require("electron");
var path_1 = __importDefault(require("path"));
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;
function createWindow() {
    // Create the browser window.
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // and load the index.html of the app.
    mainWindow.loadFile(path_1.default.resolve(__dirname, 'index.html'));
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on('ready', createWindow);
// Quit when all windows are closed.
electron_1.app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null)
        createWindow();
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLHVFQUF1RTtBQUN2RSxxQ0FBNkM7QUFDN0MsOENBQXVCO0FBRXZCLDhFQUE4RTtBQUM5RSwyRUFBMkU7QUFDM0UsSUFBSSxVQUFnQyxDQUFBO0FBRXBDLFNBQVMsWUFBWTtJQUNwQiw2QkFBNkI7SUFDN0IsVUFBVSxHQUFHLElBQUksd0JBQWEsQ0FBQztRQUM5QixLQUFLLEVBQUUsSUFBSTtRQUNYLE1BQU0sRUFBRSxHQUFHO1FBQ1gsY0FBYyxFQUFFO1lBQ2YsZUFBZSxFQUFFLElBQUk7U0FDckI7S0FDRCxDQUFDLENBQUE7SUFFRixzQ0FBc0M7SUFDdEMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxjQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFBO0lBRTFELHFCQUFxQjtJQUNyQixVQUFVLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFBO0lBRXJDLHFDQUFxQztJQUNyQyxVQUFVLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRTtRQUN2QixpRUFBaUU7UUFDakUsbUVBQW1FO1FBQ25FLG9EQUFvRDtRQUNwRCxVQUFVLEdBQUcsSUFBSSxDQUFBO0lBQ2xCLENBQUMsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQUVELHdEQUF3RDtBQUN4RCx5REFBeUQ7QUFDekQsc0RBQXNEO0FBQ3RELGNBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFBO0FBRTdCLG9DQUFvQztBQUNwQyxjQUFHLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFO0lBQzNCLDREQUE0RDtJQUM1RCw4REFBOEQ7SUFDOUQsSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLFFBQVE7UUFBRSxjQUFHLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDOUMsQ0FBQyxDQUFDLENBQUE7QUFFRixjQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRTtJQUNsQixpRUFBaUU7SUFDakUsNERBQTREO0lBQzVELElBQUksVUFBVSxLQUFLLElBQUk7UUFBRSxZQUFZLEVBQUUsQ0FBQTtBQUN4QyxDQUFDLENBQUMsQ0FBQTtBQUVGLDRFQUE0RTtBQUM1RSx1RUFBdUUifQ==