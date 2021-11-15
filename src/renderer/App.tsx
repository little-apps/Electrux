import React from 'react';
import { Switch, Route } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import Main from '@renderer/views/Main';
import Settings from '@renderer/views/Settings';
import store, { history } from '@renderer/redux/store';

interface IProps {

}

interface IState {

}

export default class App extends React.Component<IProps, IState> {
    constructor(props: Readonly<IProps>) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <HashRouter>
                        <Switch>
                            <Route path="/settings">
                                <Settings />
                            </Route>
                            <Route>
                                <Main />
                            </Route>
                        </Switch>
                    </HashRouter>
                </ConnectedRouter>
            </Provider>
        );
    }
}
