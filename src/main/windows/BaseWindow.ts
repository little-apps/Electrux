import Electron, { app, BrowserWindow } from 'electron';
import path from 'path';
import urlBuilder from 'url';

/**
 * Base for Electron windows.
 *
 * @export
 * @abstract
 * @class BaseWindow
 */
export default abstract class BaseWindow {
    private currentWindow?: BrowserWindow;

    /**
     * Creates an instance of BaseWindow.
     * @param {string} name Name of window for IpcListener
     * @param {boolean} [createWindow=true] Whether to create window or not.
     * @memberof BaseWindow
     */
    public constructor(name: string, createWindow: boolean = true) {

        if (createWindow)
            this.currentWindow = this.createBrowserWindow();
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
     * Gets the current browser window.
     *
     * @readonly
     * @type {(BrowserWindow | undefined)} Current BrowserWindow instance or undefined if no BrowserWindow has been created yet.
     * @memberof BaseWindow
     */
    public get browserWindow(): BrowserWindow | undefined {
        return this.currentWindow;
    }

    /**
     * Creates a BrowserWindow object.
     * @returns BrowserWindow object.
     * @protected
     * @memberof BaseWindow
     */
    protected createBrowserWindow() {
        const window = new BrowserWindow(this.browserWindowOptions);

        this.onBrowserWindowCreated(window);

        return window;
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
