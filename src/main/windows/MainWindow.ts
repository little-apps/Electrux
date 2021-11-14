import { BrowserWindow } from 'electron';
import path from 'path';

import BaseWindow from '@main/windows/BaseWindow';

export class MainWindow extends BaseWindow {
    constructor(name: string) {
        super(name);

        this.listener.listens({
        });
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
                preload: path.resolve(__dirname, ELECTRUX_PRELOAD_MAIN)
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
