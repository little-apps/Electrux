import { IpcMainEvent, ipcMain, ipcRenderer, IpcRendererEvent } from 'electron';
import { kebabCase } from 'string-fn'

type TListenerCallback = (event?: IpcMainEvent | IpcRendererEvent, ...args: any[]) => void;
type TListenerOptions = { callback: TListenerCallback, process?: 'main' | 'renderer', times?: 'once' | 'multiple' };
type TListeners = Record<string, TListenerCallback | TListenerOptions>;

export default class IpcListener {
	protected readonly prefix: string;

	/**
	 * Creates an instance of IpcListener.
	 * @param {string} baseName Prefix to use for channel names.
	 * @param {BaseController} [controller] Controller associated with listener.
	 * @memberof IpcListener
	 */
	constructor(prefix: string) {
		this.prefix = kebabCase(prefix);
	}

	/**
	 * Generates a channel name.
	 *
	 * @protected
	 * @param {string} name
	 * @returns Channel name in kebab case 'prefix-name'
	 * @memberof IpcListener
	 */
	protected generateChannelName(name: string) {
		return `${this.prefix}-${kebabCase(name)}`;
	}

	/**
	 * Connects listeners to IPC.
	 *
	 * @protected
	 * @param {TListeners} listeners
	 * @memberof IpcListener
	 */
	public listens(listeners: TListeners) {
		for (const [name, callback] of Object.entries(listeners)) {
			const options = this.isListenerOptions(callback) ? callback : { callback };

			this.listen(name, options);
		}
	}

	/**
	 * Connects a listener to the IPC.
	 *
	 * @protected
	 * @param {string} name Name to use for channel.
	 * @param {TListenerOptions} options Listener options
	 * @memberof IpcListener
	 */
	public listen(name: string, options: TListenerOptions) {
		const defaultOptions = { process: 'main', times: 'multiple' };
		const { process, times, callback } = { ...defaultOptions, ...options };

		const channel = this.generateChannelName(name);

		console.info(`Listening on channel '${channel}'`);

		const ipc = process === 'main' ? ipcMain : ipcRenderer;

		if (times === 'once')
			ipc.once(channel, callback);
		else
			ipc.on(channel, callback);
	}

	/**
	 * Checks if parameter has TListenerOptions type.
	 *
	 * @private
	 * @param {*} obj
	 * @returns {obj is TListenerOptions}
	 * @memberof IpcListener
	 */
	private isListenerOptions(obj: any): obj is TListenerOptions {
		return typeof obj === 'object' && 'callback' in obj;
	}
}