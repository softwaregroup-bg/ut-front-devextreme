import React from 'react';
import clsx from 'clsx';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import { Card, InputText, DataTable, Column, Toolbar, Button, Dropdown, InputMask, InputNumber, Calendar } from '../prime';
import { Styled, StyledType } from './Editor.types';
import useForm from '../hooks/useForm';
import Controller from '../Controller';
import { joiResolver } from '@hookform/resolvers/joi';
import { RefCallBack } from 'react-hook-form';

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
const Table = React.forwardRef<{}, any>(({onChange, columns, value, dataKey = 'id'}, ref) => {
    if (typeof ref === 'function') ref(React.useState({})[0]);
    const cellEditor = React.useCallback((props, field) => <InputText
        type="text"
        autoFocus={props.index === 1}
        value={props.rowData[field]}
        onChange={({target: {value}}) => {
            const updatedValue = [...props.value];
            updatedValue[props.rowIndex][props.field] = value;
            onChange(updatedValue);
        }}
        id={`${props.rowData.id}`}
    />, [onChange]);
    const [original, setOriginal] = React.useState({index: null, value: null});

    const init = React.useCallback(({index}) => {
        setOriginal({index, value: {...value[index]}});
    }, [value, setOriginal]);

    const cancel = React.useCallback(() => {
        const restored = [...value];
        restored[original.index] = original.value;
        onChange(restored);
    }, [value, onChange]);
    const addNewRow = () => {
        const id = uuidv4();
        const newValue = Object.keys(value[0] || {}).reduce((item, key) => ({...item, [key]: '', id: id}), {});
        const updatedValue = [...value, newValue];
        onChange(updatedValue);
        setEditingRows({[id]: true});
    };
    const deleteRow = () => {
        onChange(value.filter(rowData => !selected.includes(rowData)));
    };
    const [selected, setSelected] = React.useState([]);
    const [editingRows, setEditingRows] = React.useState({});
    const onRowEditChange = (event) => {
        setEditingRows(event.data);
    };
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button p-mr-2" onClick={addNewRow} />
                <Button label="Delete" icon="pi pi-trash" className="p-button" onClick={deleteRow} disabled={!selected || !selected.length} />
            </React.Fragment>
        );
    };
    return (
        <>
            <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={null}></Toolbar>
            <DataTable
                value={value}
                editMode="row"
                dataKey={dataKey}
                className="editable-cells-table"
                onRowEditInit={init}
                onRowEditCancel={cancel}
                selection={selected}
                onSelectionChange={(e) => { setSelected(e.value); }}
                editingRows={editingRows}
                onRowEditChange={onRowEditChange}
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                {
                    (columns || []).map(({ field, header }) => <Column
                        key={field}
                        field={field}
                        header={header}
                        editor={props => cellEditor(props, field)}
                    />)
                }
                <Column rowEditor headerStyle={{ width: '7rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
            </DataTable>
        </>
    );
});

function element(field: { onChange: (...event: any[]) => void; onBlur: () => void; value: any; name: string; ref: RefCallBack; className: string; }, {type = 'string', ...props} = {}) {
    const Element: React.ElementType = {
        dropdown: Dropdown,
        mask: InputMask,
        date: Calendar,
        currency: Currency,
        table: Table
    }[type] || InputText;
    return <Element {...field} {...props}/>;
}

const Editor: StyledType = ({ classes, className, fields, cards, onSubmit, trigger, get, ...rest }) => {
    const schema = Object.entries(fields).reduce(
        (schema, [name, {title, validation = Joi.string().min(0).allow('', null).default('label')}]) => schema.append({[name]: validation.label(title || name)}),
        Joi.object()
    );
    const {handleSubmit, reset, control, formState: {errors}} = useForm({resolver: joiResolver(schema)});
    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>;
    };
    React.useEffect(() => {
        if (trigger) trigger.current = handleSubmit(onSubmit);
    }, [trigger, handleSubmit, onSubmit]);
    React.useEffect(() => {
        (async() => reset(get ? await get() : {}))();
    }, [get]);
    return (
        <div {...rest}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-grid p-m-2">
                {Object.entries(cards || {}).map(([id, {title, className, fields: names = []}]) =>
                    <div key={id} className={clsx('p-col-12', className || 'p-xl-6')}>
                        <Card title={title} key={id} className='p-fluid'>
                            {names.map(name =>
                                <div className="p-field p-grid" key={name}>
                                    {fields[name].title ? <label className={clsx(fields[name].title ? `p-col-12 ${className || 'p-md-4'}` : '')}>
                                        {fields[name].title}
                                    </label> : null}
                                    <div className={clsx(fields[name].title ? `p-col-12 ${className || 'p-md-8'}` : 'p-col-12')}>
                                        <Controller
                                            control={control}
                                            name={name}
                                            render={({field}) => element({className: clsx({ 'p-invalid': errors[name] }), ...field}, fields[name].editor)}
                                        />
                                    </div>
                                    {getFormErrorMessage(name)}
                                </div>
                            )}
                        </Card>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Styled(Editor);
