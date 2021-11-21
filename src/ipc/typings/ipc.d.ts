import { IpcMainEvent, IpcRendererEvent } from "electron";

declare global {
	export type TListenerCallback = (event?: IpcMainEvent | IpcRendererEvent, ...args: any[]) => void;

	export type TElectronProcess = 'main' | 'renderer';
	export type TTimes = 'once' | 'multiple';

	export interface IIpcOptions {
		/**
		 * Indicates whether to listen on ipcMain or ipcRenderer.
		 * IPC events are always dispatched using ipcRenderer.
		 */
		process: TElectronProcess;
		times?: TTimes;
	}

	export type TAvailableIpcs = Record<string, Record<string, IIpcOptions>>;
}

