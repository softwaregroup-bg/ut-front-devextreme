import React from 'react';
import { withReadme } from 'storybook-readme';
import type { Story } from '@storybook/react';
import {Toast} from '../prime';

// @ts-ignore: md file and not a module
import README from './README.md';
import Explorer from './index';
import {fetchItems, updateItems} from './mock';

export default {
    title: 'Explorer',
    component: Explorer,
    decorators: [withReadme(README)],
    args: {
        state: {}
    }
};

const Template: Story<{
    createPermission?: string,
    editPermission?: string,
    deletePermission?: string,
    details?: {},
    children?: React.ReactNode
}> = ({
    createPermission,
    editPermission,
    deletePermission,
    details,
    children
}) => {
    const toast = React.useRef(null);
    const show = action => data => toast.current.show({
        severity: 'success',
        summary: 'Submit',
        detail: <pre>{JSON.stringify({action, data}, null, 2)}</pre>
    });
    return (
        <>
            <Toast ref={toast} />
            <div style={{height: 500, display: 'flex', flexDirection: 'column'}}>
                <Explorer
                    fetch={fetchItems}
                    keyField='id'
                    resultSet='items'
                    schema={{
                        properties: {
                            name: {
                                title: 'Name',
                                filter: true,
                                sort: true
                            },
                            size: {
                                title: 'Size',
                                filter: true,
                                sort: true
                            }
                        }
                    }}
                    columns = {['name', 'size']}
                    subscribe={updateItems}
                    details={details}
                    filter={{}}
                    actions={[{
                        title: 'Create',
                        permission: createPermission,
                        action: () => {}
                    }, {
                        title: 'Edit',
                        permission: editPermission,
                        enabled: 'current',
                        action: show('edit')
                    }, {
                        title: 'Delete',
                        permission: deletePermission,
                        enabled: 'selected',
                        action: show('delete')
                    }]}
                >
                    {children}
                </Explorer>
            </div>
        </>
    );
};

export const Basic = Template.bind({});
Basic.args = {};

export const Children = Template.bind({});
Children.args = {
    ...Basic.args,
    children: <div>Navigation component</div>
};

export const Details = Template.bind({});
Details.args = {
    ...Children.args,
    details: {
        name: 'Name'
    }
};

export const ActionPermissions = Template.bind({});
ActionPermissions.args = {
    ...Details.args,
    createPermission: 'forbidden',
    editPermission: 'granted',
    deletePermission: 'forbidden'
};
