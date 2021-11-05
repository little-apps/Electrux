import { createReducer } from 'typesafe-actions';
import { ISliceState, TSliceActionTypes } from './types';
import actions from './actions';
import { initialState } from './constants';

export default createReducer<ISliceState, TSliceActionTypes>(initialState)
    .handleAction(actions.increment, (state) => ({ ...state, count: state.count + 1 }));
