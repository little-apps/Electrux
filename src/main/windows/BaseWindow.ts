import Electron, { app, BrowserWindow } from 'electron';
import path from 'path';
import urlBuilder from 'url';
import { kebabCase } from 'string-fn'

import IpcListener from '@main/ipc/IpcListener';

/**
 * Base for Electron windows.
 *
 * @export
 * @abstract
 * @class BaseWindow
 */
export default abstract class BaseWindow {
    protected currentWindow?: BrowserWindow;
    protected readonly listener: IpcListener;

    /**
     * Initializes the base window by creating the browser window.
     */
    public constructor(name: string) {
        this.listener = new IpcListener(kebabCase(name));

        this.createBrowserWindow();
    }

    /**
     * Gets the options for the browser window.
     *
     * @readonly
     * @abstract
     * @type {Electron.BrowserWindowConstructorOptions}
     * @memberof BaseWindow
     */
    public abstract get browserWindowOptions(): Electron.BrowserWindowConstructorOptions;

    /**
     * Called after a new BrowserWindow is created.
     * @param window New BrowserWindow instance
     * @returns void
     * @public
     * @memberof BaseWindow
     */
    public onBrowserWindowCreated(window: BrowserWindow) {
        return;
    }

    /**
     * Shows the browser window.
     * @public
     * @memberof BaseWindow
     */
    public show() {
        this.currentWindow?.show();
    }

    /**
     * Creates a BrowserWindow
     * @protected
     * @memberof BaseWindow
     */
    protected createBrowserWindow() {
        this.currentWindow = new BrowserWindow(this.browserWindowOptions);

        this.onBrowserWindowCreated(this.currentWindow);
    }

    /**
     * Gets the base URL for the controllers.
     *
     * @protected
     * @returns Base URL
     * @memberof BaseWindow
     */
    protected getBaseUrl() {
        const url = this.isDev() ? ELECTRUX_DEV_URL : ELECTRUX_PROD_URL;

        return url.startsWith('http') ? url : this.resolveUrl(url);
    }

    /**
     * Resolves the path to a script.
     *
     * @protected
     * @param {string} filePath
     * @returns
     * @memberof BaseWindow
     */
    protected resolveUrl(filePath: string) {
        return urlBuilder.format({
            protocol: 'file:',
            pathname: path.join(__dirname, filePath),
            slashes: true
        });
    }
    /**
     * Checks if running in development environment.
     *
     * @protected
     * @returns
     * @memberof BaseWindow
     */
    protected isDev() {
        return !app.isPackaged && ELECTRUX_ENV === 'development';
    }
}
