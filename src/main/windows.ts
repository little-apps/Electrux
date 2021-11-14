import BaseWindow from './windows/BaseWindow';
import { MainWindow } from './windows/MainWindow';
import { SettingsWindow } from './windows/SettingsWindow';

export interface IWindows {
    [name: string]: new(name: string) => BaseWindow;
}

export type TEntry = keyof IWindows;

export const windows: IWindows = {
    "main": MainWindow,
    "settings": SettingsWindow
};

export const entry: TEntry = "main";