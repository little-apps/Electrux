import { BrowserWindow } from 'electron';
import path from 'path';

import BaseWindow from '@main/windows/BaseWindow';

export default class MainWindow extends BaseWindow {
    public constructor() {
        super('main');
    }

    public get browserWindowOptions() {
        return {
            height: 600,
            width: 800,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
                sandbox: true,
                preload: path.resolve(__dirname, ELECTRUX_PRELOADS.main)
            }
        };
    }

    public onBrowserWindowCreated(window: BrowserWindow) {
        window.loadURL(this.getBaseUrl());

        if (this.isDev()) {
            // Open the DevTools.
            window.webContents.openDevTools();
            window.maximize();
        }
    }
}
