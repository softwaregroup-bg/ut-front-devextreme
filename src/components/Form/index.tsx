import React from 'react';
import clsx from 'clsx';
import Joi from 'joi';
import get from 'lodash.get';

import { Card, InputText, InputTextarea, Dropdown, MultiSelect, TreeSelect, InputMask, InputNumber, Calendar, Checkbox } from '../prime';
import { Styled, StyledType, Properties } from './Form.types';
import useForm from '../hooks/useForm';
import Controller from '../Controller';
import { joiResolver } from '@hookform/resolvers/joi';
import { RefCallBack } from 'react-hook-form';
import {Table} from './Table';

function Currency({onChange, ref, ...props}) {
    return (
        <InputNumber
            inputRef={ref}
            onChange={e => {
                onChange?.(e.value);
            }}
            maxFractionDigits={2}
            {...props}
        />
    );
}

function Bool({onChange, ref, value, ...props}) {
    return (
        <Checkbox
            inputRef={ref}
            onChange={e => {
                onChange?.(e.checked);
            }}
            checked={value}
            {...props}
        />
    );
}

function element(
    field: {
        onChange: (...event: any[]) => void;
        onBlur: () => void;
        value: any;
        name: string;
        ref: RefCallBack;
        className: string;
    }, {
        type = 'string',
        dropdown = '',
        parent = '',
        ...props
    } = {},
    schema,
    dropdowns,
    filter
) {
    const Element: React.ElementType = {
        dropdown: Dropdown,
        dropdownTree: TreeSelect,
        multiSelect: MultiSelect,
        text: InputTextarea,
        mask: InputMask,
        date: Calendar,
        boolean: Bool,
        currency: Currency,
        table: Table
    }[type] || InputText;
    const defaults = {
        table: {
            properties: schema?.items?.properties
        },
        dropdown: {
            options: dropdowns?.[dropdown] || []
        },
        multiSelect: {
            display: 'chip',
            options: dropdowns?.[dropdown] || []
        }
    }[type] || {disabled: undefined};
    if (defaults?.options && filter) defaults.options = defaults.options.filter(item => item.parent === filter);
    if (parent && !filter) defaults.disabled = true;
    return <Element {...field} {...defaults} {...props}/>;
}

const getSchema = (properties: Properties) : Joi.Schema => Object.entries(properties).reduce(
    (schema, [name, field]) => {
        if ('properties' in field) {
            return schema.append({[name]: getSchema(field.properties)});
        } else {
            const {title, validation = Joi.string().min(0).allow('', null)} = field;
            return schema.append({[name]: validation.label(title || name)});
        }
    },
    Joi.object()
);

const getIndex = (properties: Properties, root: string) : Properties => Object.entries(properties).reduce(
    (map, [name, property]) => {
        return ('properties' in property) ? {
            ...map,
            ...getIndex(property.properties, name + '.')
        } : {
            ...map,
            [root + name]: property
        };
    },
    {}
);

interface Errors {
    message?: string
}

const flat = (e: Errors, path = '') => Object.entries(e).map(
    ([name, value]) => typeof value.message === 'string' ? (path ? path + '.' + name : name) : flat(value, name)
);

const Form: StyledType = ({ classes, className, properties, cards, layout, onSubmit, setTrigger, value, dropdowns, validation, ...rest }) => {
    const joiSchema = validation || getSchema(properties);
    const index = getIndex(properties, '');
    const {handleSubmit, control, reset, formState: {errors, isDirty}, watch, setValue} = useForm({resolver: joiResolver(joiSchema)});
    const getFormErrorMessage = (name) => {
        const error = get(errors, name);
        return error && <small className="p-error">{error.message}</small>;
    };
    React.useEffect(() => {
        if (setTrigger) setTrigger(isDirty && (prev => handleSubmit(onSubmit)));
    }, [setTrigger, handleSubmit, onSubmit, isDirty]);
    React.useEffect(() => {
        reset(value || {});
    }, [value]);

    const children: {[parent: string]: string[]} = {};

    function addParent(properties: Properties, name: string) {
        const parent = properties[name]?.editor?.parent;
        if (parent) {
            const items = children[parent];
            if (items) items.push(name);
            else children[parent] = [name];
            return watch(parent);
        }
    }

    const parentChange = (name : string) => {
        const items = children[name];
        if (items) items.forEach(child => setValue(child, null));
    };

    function card(id: string) {
        const {title, properties = [], flex} = (cards[id] || {title: '❌ ' + id});
        return (
            <Card title={title} key={id} className='p-fluid p-mb-3'>
                <div className={clsx(flex && 'p-d-flex p-flex-wrap')}>
                    {properties.map(name => index[name]
                        ? <div className={clsx('p-field p-grid', flex)} key={name}>
                            {index[name].title ? <label className='p-col-12 p-md-4'>
                                {index[name].title}
                            </label> : null}
                            <div className={clsx(index[name].title ? 'p-col-12 p-md-8' : 'p-col-12')}>
                                <Controller
                                    control={control}
                                    name={name}
                                    render={
                                        ({field}) => element(
                                            {
                                                className: clsx({ 'p-invalid': errors[name] }),
                                                ...field,
                                                onChange: e => {
                                                    try {
                                                        parentChange(name);
                                                    } finally {
                                                        field.onChange(e);
                                                    }
                                                }
                                            },
                                            index[name].editor,
                                            index[name],
                                            dropdowns,
                                            addParent(index, name)
                                        )
                                    }
                                />
                            </div>
                            {getFormErrorMessage(name)}
                        </div>
                        : <div className="p-field p-grid" key={name}>❌ {name}</div>
                    )}
                </div>
            </Card>
        );
    }
    const visibleCards = (layout || Object.keys(cards));
    const errorFields = flat(errors).flat();
    const visibleProperties = visibleCards.map(id => {
        const nested = [].concat(id);
        return nested.map(cardName => cards[cardName]?.properties);
    }).flat(10).filter(Boolean);

    return (
        <form {...rest} onSubmit={handleSubmit(onSubmit)} className={clsx('p-grid p-col p-mt-2', className)}>
            {
                !!Object.keys(errors).length && <div className='p-col-12'>
                    {errorFields.map(name => !visibleProperties.includes(name) && <><small className="p-error">{get(errors, name)?.message}</small><br /></>)}
                </div>
            }
            {visibleCards.map(id => {
                const nested = [].concat(id);
                const key = nested[0];
                return (
                    <div key={key} className={clsx('p-col-12', cards[key]?.className || 'p-xl-6')}>
                        {nested.map(card)}
                    </div>
                );
            })}
        </form>
    );
};

export default Styled(Form);
