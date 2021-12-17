import store, { reducers, actions, services } from '@renderer/redux/store';
import { ThunkDispatch, ActionType } from 'redux-thunk';

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