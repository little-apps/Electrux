export interface IElectronAPI {
    settings: {
        show: () => void;
    }
}

declare global {
    interface Window {
        electron: IElectronAPI;
    }
}