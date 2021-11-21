import { BrowserWindow, IpcMainEvent, IpcRendererEvent } from 'electron';
import buildUrl from 'build-url-ts';
import settings from 'electron-settings';

import BaseWindow from '@main/windows/BaseWindow';
import { listen } from '@ipc/main';

export default class SettingsWindow extends BaseWindow {
    constructor(name: string, createWindow: boolean = true) {
        super(name, createWindow);

        listen('settings.show', this.show.bind(this));
    }

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
    }

    public set(event?: IpcMainEvent | IpcRendererEvent, key?: string | Record<string, any>, value?: any) {
        if (key === undefined)
            return;

        return typeof key !== 'string' ? settings.set(key) : settings.set(key, value);
    }
}
