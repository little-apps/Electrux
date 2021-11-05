import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from "redux-thunk";
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import example from './example/index';

const services = {
    example: example.services
};

const actions = {
    example: example.actions
};

const history = createBrowserHistory<TLocationState>();

const reducers = combineReducers({
    example: example.reducers,
    router: connectRouter(history)
});

/*const epics =
    combineEpics(
    );*/

export const epicMiddleware = createEpicMiddleware<TRootAction, TRootAction, TRootState, TServices>({ dependencies: services });

const middlewares = [thunk, epicMiddleware, routerMiddleware(history)];

const store = createStore(reducers, applyMiddleware(...middlewares));

//epicMiddleware.run(epics);

const initialState = store.getState();

export default store;
export { actions, reducers/*, epics*/, services, history, initialState };
