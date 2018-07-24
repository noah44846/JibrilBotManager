import { app, BrowserWindow, ipcMain as ipc } from 'electron';

const JibrilBot = require('./bot/JibrilBot.js');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

let mainWindow;

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1200,
        minHeight: 800,
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // and load the index.html of the app.
    mainWindow.loadURL(path.join('file://', __dirname, 'homePage.html'));

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object.
        mainWindow = null;
    });
};

const initialize = () => {
    ipc.on('asynchronous-message', async (event, arg) => {
        if (arg === 'start-bot') {
            JibrilBot.start();
            event.sender.send('asynchronous-reply', 'starting');
        }
    });
    createWindow();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', initialize);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
