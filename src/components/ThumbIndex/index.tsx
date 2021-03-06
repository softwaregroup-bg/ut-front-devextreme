import React from 'react';
import clsx from 'clsx';

import { ListBox, PanelMenu, TabMenu, Ripple } from '../prime';
import { Styled, StyledType } from './ThumbIndex.types';

const ThumbIndex: StyledType = ({ name, classes, className, items, orientation = 'left', children, onFilter, ...rest }) => {
    const [[selectedList, activeIndex], setList] = React.useState([items[0], 0]);
    const handleListChange = React.useCallback(({value, index}) => {
        if (index === undefined) index = value.index;
        setList([value, index]);
        onFilter(value?.items?.[0] || value);
    }, [onFilter]);
    const model = React.useMemo(() => {
        const command = ({item}) => onFilter && onFilter(item);
        const result = (selectedList?.items || []).map((item, index) => ({
            ...item,
            command,
            expanded: !index,
            items: (item.items || []).map(leaf => ({...leaf, expanded: false}))
        }));
        return result;
    }, [onFilter, selectedList]);
    const itemsTemplate = React.useMemo(() => {
        const template = (item, {iconClassName, onClick: handleClick, labelClassName, className}) => (
            <a
                href={item.url || '#'}
                className={className}
                target={item.target}
                onClick={handleClick}
                role="presentation"
            >
                {item.icon && <span className={iconClassName}></span>}
                {item.label && <span className={labelClassName} data-testid={(name || '') + item.id + 'Tab'}>{item.label}</span>}
                <Ripple />
            </a>
        );
        return items.map((item, index) => item.id ? ({template, ...item, index}) : item);
    }, [items, name]);

    const tabs = orientation === 'left' ? <ListBox
        value={selectedList}
        options={itemsTemplate}
        itemTemplate={({icon, label}) => <><i className={icon}> {label}</i></>}
        onChange={handleListChange}
        className='border-none'
    /> : <TabMenu
        model={itemsTemplate}
        activeIndex={activeIndex}
        onTabChange={handleListChange}
    />;
    return (
        <div className={clsx('flex flex-row', {'lg:col-2': !!model?.length}, className)} {...rest}>
            {tabs}
            {!!model?.length && <PanelMenu
                className='flex-1'
                model={model}
            />}
            {children}
        </div>
    );
};

export default Styled(ThumbIndex);
