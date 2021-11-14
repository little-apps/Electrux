import store, { reducers, actions, services } from '@renderer/redux/store';
import { ThunkDispatch, ActionType } from 'redux-thunk';

export interface IElectronAPI {
    settings: {
        show: () => void;
        set: (key: string | Record<string, any>, value?: any) => Promise<void>;
        has: (key: string) => Promise<boolean>;
        get: (key?: string) => Promise<any>;
        unset: (key?: string) => Promise<void>;
    }
}

declare global {
    interface Window {
        electron: IElectronAPI;
    }

    export type TStore = typeof store;
    export type TRootState = ReturnType<typeof reducers>;
    export type DefaultRootState = TRootState;
    export type TRootAction = ReturnType<typeof actions>;
    export type TDispatch = ThunkDispatch<TRootState, void, TRootAction>;
    export type TServices = typeof services;

    export type TRootEpic = Epic<TRootAction, TRootAction, TRootState, TServices>;

    interface ILocationState {
    }

    export type TLocationState = ILocationState | undefined;
}