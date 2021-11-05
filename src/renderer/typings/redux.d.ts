import { ThunkDispatch } from "redux-thunk";

import { Epic } from 'redux-observable';
import { ActionType, StateType } from 'typesafe-actions';
import store, { reducers, actions, services } from "redux/store";

declare global {
    export type TStore = StateType<typeof store>;
    export type TRootState = StateType<typeof reducers>;
    export type DefaultRootState = TRootState;
    export type TRootAction = ActionType<typeof actions>;
    export type TDispatch = ThunkDispatch<TRootState, void, TRootAction>;
    export type TServices = typeof services;

    export type TRootEpic = Epic<TRootAction, TRootAction, TRootState, TServices>;

    interface ILocationState {
    }

    export type TLocationState = ILocationState | undefined;
}
