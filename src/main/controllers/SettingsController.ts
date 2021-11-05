import { BrowserWindow, ipcMain } from 'electron';
import buildUrl from 'build-url-ts';

import BaseController from './BaseController';

export class SettingsController extends BaseController {
    public get browserWindowOptions() {
        return {
            height: 600,
            width: 800,
            autoHideMenuBar: true,
            show: false,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
                sandbox: true
            }
        };
    }

    public onBrowserWindowCreated(window: BrowserWindow) {
        const url = buildUrl(this.getBaseUrl(), {
            hash: '/settings'
        });

        window.loadURL(url);

        if (this.isDev()) {
            // Open the DevTools.
            window.webContents.openDevTools();
        }

        ipcMain.on('settings-show', () => window.show());
    }
}
