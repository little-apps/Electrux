import { ipcMain, IpcMainEvent, ipcRenderer, IpcRendererEvent } from "electron";
import { generateChannelName } from "./shared";

const moduleListeners: Record<string, TListenerCallback[]> = {};

/**
 * Calls the callback when an event on channel is issued.
 *
 * @param {string} channel
 * @param {TListenerCallback} callback
 */
export const listen = (channel: string, callback: TListenerCallback) => {
	if (!(channel in moduleListeners))
		moduleListeners[channel] = [];

	moduleListeners[channel].push(callback);
}

/**
 * Attaches channel events to ipcMain or ipcRenderer.
 * This is to be called when Electron is started.
 * @param {TAvailableIpcs} ipcs IPCs to listen for.
 */
export const attachListeners = (ipcs: TAvailableIpcs) => {
	for (const [module, channels] of Object.entries(ipcs)) {
		for (const [name, options] of Object.entries(channels)) {
			const channel = generateChannelName(module, name);
			attachListener(channel, options);
		}
	}
}

/**
 * Attaches channel to ipcMain or ipcRenderer, so the corresponding listeners are called when channel event is issued.
 *
 * @param {string} channel
 * @param {IIpcOptions} { process, times }
 */
export const attachListener = (channel: string, { process, times }: IIpcOptions) => {
	console.info(`Listening on channel '${channel}'`);

	const ipcCallback: TListenerCallback = (event?: IpcMainEvent | IpcRendererEvent, ...args: any[]) => {
		if (!(channel in moduleListeners))
			return;

		const callbacks = moduleListeners[channel];

		callbacks.forEach((callback) => callback(event, ...args));
	};

	const ipc = process === 'main' ? ipcMain : ipcRenderer;

	if (times === 'once')
		ipc.once(channel, ipcCallback);
	else
		ipc.on(channel, ipcCallback);
}