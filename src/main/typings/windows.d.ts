import BaseWindow from '@main/windows/BaseWindow';

declare global {
	type Constructor<T> = {
		new(...args: any[]): T;
		readonly prototype: T;
	}

	export type TWindowCtor = Constructor<BaseWindow>;
	export type TWindows = Record<string, TWindowCtor>;

	export type TEntry = keyof TWindows;
}