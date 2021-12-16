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
    public readonly name: string;
    private currentWindow?: BrowserWindow;

    /**
     * Creates an instance of BaseWindow.
     * @param {string} name Name of window for IpcListener
     * @param {boolean} [createWindow=false] Whether to create window or not.
     * @memberof BaseWindow
     */
    public constructor(name: string, createWindow: boolean = false) {
        this.name = name;

        if (createWindow)
            this.create();
    }

    public create() {
        return this.currentWindow = this.createBrowserWindow();
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
     * Called when BrowserWindow is closed.
     *
     * @param {BrowserWindow} window
     * @memberof BaseWindow
     */
    public onBrowserWindowClosed(window: BrowserWindow) {
        this.currentWindow = undefined;
    }

    /**
     * Gets the current browser window.
     *
     * @readonly
     * @type {BrowserWindow} Current BrowserWindow instance or undefined if no BrowserWindow has been created yet.
     * @memberof BaseWindow
     */
    public get browserWindow(): BrowserWindow {
        const window = this.currentWindow ?? this.create();

        return window;
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

        window.on('closed', () => this.onBrowserWindowClosed(window));

        return window;
    }

    /**
     * Gets the base URL.
     *
     * @protected
     * @returns Either the URL to the Webpack Dev Server (if in watch mode) or the relative path to the index.html file.
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
