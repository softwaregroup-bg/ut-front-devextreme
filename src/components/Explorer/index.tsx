import React from 'react';
import { DataTable, Column, Button, Toolbar, Splitter, SplitterPanel } from '../prime';

import { Styled, StyledType } from './Explorer.types';
import useToggle from '../hooks/useToggle';
import clsx from 'clsx';
interface TableFilter {
    filters?: {
        [name: string]: {
            value: any;
            matchMode: any;
        }
    },
    sortField?: string,
    sortOrder?: -1 | 1,
    first: number,
    page: number
}

const Explorer: StyledType = ({
    classes,
    className,
    keyField,
    fetch,
    fields,
    resultSet,
    children,
    details,
    actions,
    filter,
    pageSize = 10
}) => {
    const [tableFilter, setFilters] = React.useState<TableFilter>({
        filters: {},
        first: 0,
        page: 1
    });
    const [[items, totalRecords], setItems] = React.useState([[], 0]);
    const [selected, setSelected] = React.useState(null);
    const [current, setCurrent] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const isEnabled = enabled => {
        if (typeof enabled !== 'string') return !!enabled;
        switch (enabled) {
            case 'current': return !!current;
            case 'selected': return selected && selected.length > 0;
            default: return false;
        }
    };
    const buttons = React.useMemo(() => (actions || []).map(({title, action, enabled = true}, index) =>
        <Button
            key={index}
            label={title}
            onClick={() => action({
                id: current && current[keyField],
                current,
                selected
            })}
            disabled={!isEnabled(enabled)}
            className="p-mr-2"
        />
    ), [keyField, current, selected]);
    React.useEffect(() => {
        async function load() {
            if (!fetch) {
                setItems([[], 0]);
            } else {
                setLoading(true);
                try {
                    const items = await fetch({
                        [resultSet || 'filterBy']: {...Object.entries(tableFilter.filters).reduce((prev, [name, {value}]) => ({...prev, [name]: value}), {}), ...filter},
                        orderBy: {
                            field: tableFilter.sortField,
                            dir: {[-1]: 'DESC', 1: 'ASC'}[tableFilter.sortOrder]
                        },
                        paging: {
                            pageSize,
                            pageNumber: Math.floor(tableFilter.first / pageSize)
                        }
                    });
                    const records = resultSet ? items[resultSet] : items;
                    let total = items.pagination && items.pagination.recordsTotal;
                    if (total == null) {
                        total = (records && records.length) || 0;
                        if (total === pageSize) total++;
                        total = tableFilter.first + total;
                    }
                    setItems([records, total]);
                } finally {
                    setLoading(false);
                }
            }
        }
        load();
    }, [fetch, tableFilter, filter]);
    const Details = () =>
        <div style={{ width: '200px' }}>{
            current && Object.entries(details).map(([name, value], index) =>
                <div className={classes.details} key={index}>
                    <div className={classes.detailsLabel}>{value}</div>
                    <div className={classes.detailsValue}>{current[name]}</div>
                </div>
            )
        }</div>;
    const [navigationOpened, navigationToggle] = useToggle(true);
    const [detailsOpened, detailsToggle] = useToggle(true);
    const handleFilterPageSort = React.useCallback(event => {
        setFilters(prev => ({...prev, ...event}));
    }, []);
    return (
        <div className={clsx('p-d-flex', 'p-flex-column', className)} style={{height: '100%'}} >
            <Toolbar
                left={
                    <>
                        {children && <Button icon="pi pi-bars" className="p-mr-2" onClick={navigationToggle}/>}
                        {buttons}
                    </>
                }
                right={
                    <>
                        <Button icon="pi pi-bars" className="p-mr-2" onClick={detailsToggle}/>
                    </>
                }
            />
            <Splitter style={{flexGrow: 1}}>
                {[
                    children && navigationOpened && <SplitterPanel key='nav' size={15}>{children}</SplitterPanel>,
                    <SplitterPanel key='items' size={75}>
                        <DataTable
                            autoLayout
                            lazy
                            rows={pageSize}
                            totalRecords={totalRecords}
                            paginator
                            first={tableFilter.first}
                            sortField={tableFilter.sortField}
                            sortOrder={tableFilter.sortOrder}
                            filters={tableFilter.filters}
                            onPage={handleFilterPageSort}
                            onSort={handleFilterPageSort}
                            onFilter={handleFilterPageSort}
                            loading={loading}
                            dataKey={keyField}
                            value={items}
                            selection={selected}
                            onSelectionChange={e => setSelected(e.value)}
                            onRowSelect={e => setCurrent(e.data)}
                        >
                            <Column selectionMode="multiple" style={{width: '3em'}}/>
                            {fields.map(({field, title, filter, sort, action}) => <Column
                                key={field}
                                field={field}
                                header={title}
                                body={action && (row => <Button
                                    label={row[field]}
                                    style={{padding: 0, minWidth: 'inherit'}}
                                    className='p-button-link'
                                    onClick={() => action({
                                        id: row && row[keyField],
                                        current: row,
                                        selected: [row]
                                    })}
                                />)}
                                filter={!!filter}
                                sortable={!!sort}
                            />)}
                        </DataTable>
                    </SplitterPanel>,
                    detailsOpened && <SplitterPanel key='details' size={10}>{Details()}</SplitterPanel>
                ].filter(Boolean)}
            </Splitter>
        </div>
    );
};

export default Styled(Explorer);
