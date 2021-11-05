import Electron, { app, BrowserWindow } from 'electron';
import path from 'path';
import urlBuilder from 'url';

/**
 * Base controller for Electron windows.
 *
 * @export
 * @abstract
 * @class BaseController
 */
export default abstract class BaseController {
    protected currentWindow?: BrowserWindow;

    /**
     * Initializes the base controller by creating the browser window.
     */
    public constructor() {
        this.createBrowserWindow();
    }

    /**
     * Gets the options for the browser window.
     *
     * @readonly
     * @abstract
     * @type {Electron.BrowserWindowConstructorOptions}
     * @memberof BaseController
     */
    public abstract get browserWindowOptions(): Electron.BrowserWindowConstructorOptions;

    /**
     * Called after a new BrowserWindow is created.
     * @param window New BrowserWindow instance
     * @returns void
     * @public
     * @memberof BaseController
     */
    public onBrowserWindowCreated(window: BrowserWindow) {
        return;
    }

    /**
     * Shows the browser window.
     * @public
     * @memberof BaseController
     */
    public show() {
        this.currentWindow?.show();
    }

    /**
     * Creates a BrowserWindow
     * @protected
     * @memberof BaseController
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
     * @memberof BaseController
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
     * @memberof BaseController
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
     * @memberof BaseController
     */
    protected isDev() {
        return !app.isPackaged && ELECTRUX_ENV === 'development';
    }
}
