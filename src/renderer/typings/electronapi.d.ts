export interface IElectronAPI {
    main: {
    };
    settings: {
        open: () => void;
        set: (key: string | Record<string, any>, value?: any) => Promise<void>;
        has: (key: string) => Promise<boolean>;
        get: (key?: string) => Promise<any>;
        unset: (key?: string) => Promise<void>;
    };
}

declare global {
    interface Window {
        electron: IElectronAPI;
    }
}
