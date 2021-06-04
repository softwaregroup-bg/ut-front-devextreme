import React from 'react';
import { withReadme } from 'storybook-readme';
import Joi from 'joi';

import Wrap from '../test/wrap';

// @ts-ignore: md file and not a module
import README from './README.md';
import ThumbIndex from './index';
import Editor from '../Editor';
import {Toast, Toolbar, Button} from '../prime';

export default {
    title: 'ThumbIndex',
    component: ThumbIndex,
    decorators: [withReadme(README)]
};

const state = {
};

const tabledata = [
    {
        id: '1000',
        code: 'f230fh0g3',
        name: 'Bamboo Watch',
        description: 'Product Description',
        image: 'bamboo-watch.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        rating: 5
    },
    {
        id: '1001',
        code: 'nvklal433',
        name: 'Black Watch',
        description: 'Product Description',
        image: 'black-watch.jpg',
        price: 72,
        category: 'Accessories',
        quantity: 61,
        inventoryStatus: 'INSTOCK',
        rating: 4
    },
    {
        id: '1002',
        code: 'zz21cz3c1',
        name: 'Blue Band',
        description: 'Product Description',
        image: 'blue-band.jpg',
        price: 79,
        category: 'Fitness',
        quantity: 2,
        inventoryStatus: 'LOWSTOCK',
        rating: 3
    },
    {
        id: '1003',
        code: '244wgerg2',
        name: 'Blue T-Shirt',
        description: 'Product Description',
        image: 'blue-t-shirt.jpg',
        price: 29,
        category: 'Clothing',
        quantity: 25,
        inventoryStatus: 'INSTOCK',
        rating: 5
    },
    {
        id: '1004',
        code: 'h456wer53',
        name: 'Bracelet',
        description: 'Product Description',
        image: 'bracelet.jpg',
        price: 15,
        category: 'Accessories',
        quantity: 73,
        inventoryStatus: 'INSTOCK',
        rating: 4
    },
    {
        id: '1005',
        code: 'av2231fwg',
        name: 'Brown Purse',
        description: 'Product Description',
        image: 'brown-purse.jpg',
        price: 120,
        category: 'Accessories',
        quantity: 0,
        inventoryStatus: 'OUTOFSTOCK',
        rating: 4
    },
    {
        id: '1006',
        code: 'bib36pfvm',
        name: 'Chakra Bracelet',
        description: 'Product Description',
        image: 'chakra-bracelet.jpg',
        price: 32,
        category: 'Accessories',
        quantity: 5,
        inventoryStatus: 'LOWSTOCK',
        rating: 3
    },
    {
        id: '1007',
        code: 'mbvjkgip5',
        name: 'Galaxy Earrings',
        description: 'Product Description',
        image: 'galaxy-earrings.jpg',
        price: 34,
        category: 'Accessories',
        quantity: 23,
        inventoryStatus: 'INSTOCK',
        rating: 5
    },
    {
        id: '1008',
        code: 'vbb124btr',
        name: 'Game Controller',
        description: 'Product Description',
        image: 'game-controller.jpg',
        price: 99,
        category: 'Electronics',
        quantity: 2,
        inventoryStatus: 'LOWSTOCK',
        rating: 4
    },
    {
        id: '1009',
        code: 'cm230f032',
        name: 'Gaming Set',
        description: 'Product Description',
        image: 'gaming-set.jpg',
        price: 299,
        category: 'Electronics',
        quantity: 63,
        inventoryStatus: 'INSTOCK',
        rating: 3
    }
];

const index = [{
    icon: 'pi pi-user',
    items: [{
        label: 'Main',
        filter: ['main', 'reg', 'financial', 'table'],
        items: [
            {label: 'Identification'},
            {label: 'Registration'},
            {label: 'Financial data'}
        ]
    }, {
        label: 'Contacts',
        filter: ['address', 'phone', 'email', 'person'],
        items: [
            {label: 'Address'},
            {label: 'Phone & Mail'},
            {label: 'Contact person'}
        ]
    }]
}, {
    icon: 'pi pi-users'
}, {
    icon: 'pi pi-book'
}, {
    icon: 'pi pi-clock'
}];

const identifierTypeEditor = {
    type: 'dropdown',
    options: [
        {value: 1, label: 'Sole Trader'},
        {value: 2, label: 'Ltd.'}
    ]
};

const currencyEditor = {
    type: 'dropdown',
    options: [
        {value: 1, label: 'USD'},
        {value: 2, label: 'EUR'}
    ]
};

const tableDataEditor = {
    type: 'table',
    // mask: '99/99/9999',
    columns: [
        { field: 'code', header: 'Code' },
        { field: 'name', header: 'Name' },
        { field: 'quantity', header: 'Quantity' },
        { field: 'price', header: 'Price' },
        { field: 'description', header: 'Description' }
    ]
};

const fields = [
    {card: 'main', name: 'identifierType', title: 'Identifier type *', editor: identifierTypeEditor, validation: Joi.number().integer().required().label('Identifier type')},
    {card: 'main', name: 'identifier', title: 'Identifier *', validation: Joi.string().required()},
    {card: 'main', name: 'clientNumber', title: 'Client number'},
    {card: 'main', name: 'legalStatus', title: 'Legal status'},
    {card: 'reg', name: 'regDocType', title: 'Document type'},
    {
        card: 'reg',
        name: 'regDocNum',
        title: 'Document number',
        validation: Joi.string()
            .when('regDocType', {
                is: [Joi.string(), Joi.number()],
                then: Joi.required(),
                otherwise: Joi.allow('')
            })
            .label('Document number')
    },
    {card: 'reg', name: 'regIssuer', title: 'Issuer'},
    {card: 'reg', name: 'regCountry', title: 'Country'},
    {card: 'reg', name: 'regStart', title: 'Issuing date', editor: {type: 'date', mask: '99/99/9999'}, validation: Joi.date()},
    {card: 'reg', name: 'regEnd', title: 'Valid until', editor: {type: 'date', mask: '99/99/9999'}, validation: Joi.date()},
    {card: 'financial', name: 'capital', title: 'Issued Capital', editor: {type: 'currency'}, validation: Joi.number()},
    {card: 'financial', name: 'capitalCurrency', title: 'Issued Capital currency', editor: currencyEditor, validation: Joi.number().integer()},
    {card: 'financial', name: 'capitalDate', title: 'Issued on'},
    {card: 'financial', name: 'capitalCountry', title: 'Capital country'},
    {card: 'financial', name: 'ownerNationality', title: 'Capital owner nationality'},
    {card: 'address', name: 'addressCountry', title: 'Country'},
    {card: 'address', name: 'addressCity', title: 'City'},
    {card: 'address', name: 'addressZip', title: 'Post code'},
    {card: 'address', name: 'addressStreet', title: 'Street'},
    {card: 'phone', name: 'phoneType', title: 'Type'},
    {card: 'phone', name: 'phoneCountry', title: 'Country'},
    {card: 'phone', name: 'phoneNumber', title: 'Phone number'},
    {card: 'email', name: 'emailType', title: 'Type'},
    {card: 'email', name: 'emailAddress', title: 'Email address'},
    {card: 'person', name: 'personName', title: 'Name'},
    {card: 'person', name: 'personPosition', title: 'Position'},
    {card: 'table', name: 'editableDataTable', title: 'Table name', editor: tableDataEditor}
];

const cards = [
    {id: 'main', title: 'Main data', className: 'p-lg-6 p-xl-4'},
    {id: 'reg', title: 'Registration', className: 'p-lg-6 p-xl-4'},
    {id: 'financial', title: 'Financial data', className: 'p-lg-6 p-xl-4'},
    {id: 'table', title: 'Table', className: 'p-xl-12'},
    {id: 'address', title: 'Address'},
    {id: 'phone', title: 'Phone'},
    {id: 'email', title: 'E-mail'},
    {id: 'person', title: 'Contact person'}
];

export const Basic: React.FC<{}> = () => {
    const [filter, setFilter] = React.useState(index?.[0]?.items?.[0].filter || []);
    const toast = React.useRef(null);
    const trigger = React.useRef(null);
    return (
        <Wrap state={state}>
            <Toast ref={toast} />
            <Toolbar right={<Button icon='pi pi-save' onClick={() => trigger?.current?.()}/>}/>
            <ThumbIndex index={index} onFilter={setFilter}>
                <Editor
                    style={{flexGrow: 3, overflowY: 'auto', height: '100%'}}
                    fields={fields}
                    cards={cards.filter(({id}) => filter && filter.includes(id))}
                    onSubmit={formData => toast.current.show({
                        severity: 'success',
                        summary: 'Submit',
                        detail: <pre>{JSON.stringify(formData, null, 2)}</pre>
                    })}
                    trigger={trigger}
                    get={() => Promise.resolve(tabledata)}
                />
            </ThumbIndex>
        </Wrap>
    );
};
