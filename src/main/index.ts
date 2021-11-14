import { app, BrowserWindow } from 'electron';
import unhandled from 'electron-unhandled';

import { windows, entry, IWindows, TEntry } from '@main/windows';
import BaseWindow from '@main/windows/BaseWindow';

console.log('👋 Hello from the main side!');

unhandled();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

let createdWindows: BaseWindow[] = [];

/**
 * Creates a new BaseWindow object using the name and class type.
 *
 * @template T
 * @param {string} name Name of window
 * @param {new(name: string) => T} ctor Class type with constructor that takes in name.
 * @returns BaseWindow object
 */
const createWindow = <T extends BaseWindow>(name: string, ctor: new(name: string) => T) => {
    return new ctor(name);
};

/**
 * Creates BaseWindow objects from object and stores them in createdWindows array.
 *
 */
const createWindows = (windowsToCreate: IWindows, entryWindowName: TEntry) => {
    const windowsCreated: BaseWindow[] = [];

    for (const [name, type] of Object.entries(windowsToCreate)) {
        const window = createWindow(name, type);

        if (entryWindowName === name)
            window.show();

        windowsCreated.push(window);
    }

    return windowsCreated;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => createdWindows = createWindows(windows, entry));

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createdWindows = createWindows(windows, entry);
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
