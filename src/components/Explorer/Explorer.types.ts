import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';
import { DataTableProps } from '../prime';

import type {Schema, Dropdowns, Action, WidgetReference} from '../types';

export interface Props {
    keyField?: string;
    resultSet?: string;
    schema: Schema;
    columns: WidgetReference[];
    fetch: (params: {
        [resultSet: string]: {},
        orderBy: {
            field: string,
            dir: string
        }[],
        paging: {
            pageSize: number,
            pageNumber: number
        }
    }) => Promise<{
        pagination?: {
            recordsTotal: number
        },
        [data: string]: any
    }>;
    subscribe?: (callback: (rows: any) => void) => () => void;
    onDropdown?: (params: string[]) => Promise<Dropdowns>,
    className?: string;
    details?: {};
    actions?: Action[];
    filter?: {};
    index?: {};
    showFilter?: boolean;
    pageSize?: number;
    table?: DataTableProps;
}

const styles = createStyles({
    component: {
        '& .p-datatable-wrapper': {
            overflowX: 'auto'
        }
    },
    details: {
        marginBottom: 15
    },
    detailsLabel: {},
    detailsValue: {}
});

export const Styled = withStyles(styles);
export type StyledType = React.FC<Props & WithStyles<typeof styles>>
