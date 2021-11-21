import BaseWindow from '@main/windows/BaseWindow';

declare global {
	export type TWindowCtor = new(name: string) => BaseWindow;
	export type TWindows = Record<string, TWindowCtor>;

	export type TEntry = keyof TWindows;
}