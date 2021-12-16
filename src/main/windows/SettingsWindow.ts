import { BrowserWindow, IpcMainEvent, IpcRendererEvent } from 'electron';
import buildUrl from 'build-url-ts';
import settings from 'electron-settings';
import path from 'path';

import BaseWindow from '@main/windows/BaseWindow';
import { listen } from '@ipc/main';

export default class SettingsWindow extends BaseWindow {
    public constructor() {
        super('settings');

        listen('settings.open', this.show.bind(this));
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
                sandbox: true,
                preload: path.resolve(__dirname, ELECTRUX_PRELOAD_SETTINGS)
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

    /**
     * Makes the settings window visible.
     *
     * @memberof SettingsWindow
     */
    public show() {
        this.browserWindow.show();
    }

    public set(event?: IpcMainEvent | IpcRendererEvent, key?: string | Record<string, any>, value?: any) {
        if (key === undefined)
            return;

        return typeof key !== 'string' ? settings.set(key) : settings.set(key, value);
    }
}
