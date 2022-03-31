import React from 'react';
import {Reducer, Middleware, Action, AnyAction} from 'redux';
import type { MenuItem as PrimeMenuItem } from 'primereact/menuitem';
export interface MenuItem extends PrimeMenuItem {
    title: string;
    path?: string;
    component?: () => any;
    tab?: ({}) => Promise<{
        title: string;
        component?: () => any
    }>,
    params?: {
        id: string | number
    },
    action?: () => AnyAction
}
export interface State {
    error?: {
        open: boolean;
        title: string;
        message: string;
        type: string;
        statusCode: number;
        params: {};
    };
    loader?: {
        toJS: () => {
            open: boolean;
            requests: number;
            message: string;
        }
    };
    login?: any;
    portal?: {
        tabs: {
            title: string;
            path: string;
            Component: React.FC;
            params?: {}
        }[];
        hideTabs?: boolean;
        menu: MenuItem[];
        menuClass?: 'menu' | 'menuGrow';
        rightMenu?: MenuItem[];
        rightMenuClass?: 'menu' | 'menuGrow';
        rightMenuItems?: MenuItem[]
    };
}

export interface Props {
    reducers?: {
        [key: string]: Reducer
    },
    state?: State,
    middleware?: Middleware[],
    onDispatcher?: (fn: (action: Action) => Action) => boolean
}

export type StoreComponent = React.FC<Props>
