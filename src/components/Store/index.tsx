import React from 'react';
import {Provider} from 'react-redux';
import {createHashHistory, createMemoryHistory} from 'history';
import {combineReducers, createStore, applyMiddleware} from 'redux';
import {ConnectedRouter, connectRouter, routerMiddleware} from 'connected-react-router';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';

import * as front from '../reducers';
import frontMiddleware from './middleware';
import { StoreComponent } from './Store.types';

const composeEnhancers = composeWithDevTools({
    serialize: true,
    actionSanitizer: action => {
        // @ts-ignore
        if (action.type.toString() === 'Symbol(REDUCE)' && action.reducer) {
            return {
                ...action,
                // @ts-ignore
                type: `handler ${action.reducer.name}`
            };
        } else if (typeof action.type === 'symbol') {
            return {
                ...action,
                type: action.type.toString() // DevTools doesn't work with Symbols
            };
        }
        return action;
    }
});

const Store: StoreComponent = ({middleware = [], reducers, state, children, onDispatcher}) => {
    const history = (typeof window !== 'undefined') ? createHashHistory() : createMemoryHistory();
    const store = createStore(
        combineReducers({
            router: connectRouter(history),
            ...front,
            ...reducers
        }),
        state,
        composeEnhancers(applyMiddleware(thunk, ...middleware, frontMiddleware, routerMiddleware(history)))
    );
    if (onDispatcher) onDispatcher(action => store.dispatch(action));
    return (
        <Provider store={store}>
            <ConnectedRouter history={history}>
                {children}
            </ConnectedRouter>
        </Provider>
    );
};

export default Store;
