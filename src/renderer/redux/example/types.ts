import { ActionType } from 'typesafe-actions';
import actions from './actions';

export type TSliceActionTypes = ActionType<typeof actions>;

export interface ISliceState {
    count: number;
}
