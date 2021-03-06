import React from 'react';
import { withReadme } from 'storybook-readme';
import type { Story, Meta } from '@storybook/react';

// @ts-ignore: md file and not a module
import README from './README.md';
import Permission from './index';
import type { Props } from './Permission.types';

import state from '../test/state';

const meta: Meta = {
    title: 'Permission',
    component: Permission,
    decorators: [withReadme(README)],
    args: {
        state
    }
};
export default meta;

const Template: Story<Props & {state: {}}> = ({state, ...args}) => <Permission {...args}>Permissions checked: {String(args.permission)}</Permission>;

export const Basic: Story<Props> = Template.bind({});
Basic.args = {
    permission: undefined
};

export const Granted: Story<Props> = Template.bind({});
Granted.args = {
    ...Basic.args,
    permission: 'granted'
};

export const Multiple: Story<Props> = Template.bind({});
Multiple.args = {
    ...Basic.args,
    permission: ['granted', 'pageXYZ']
};

export const Wildcard: Story<Props> = Template.bind({});
Wildcard.args = {
    ...Basic.args,
    permission: 'pageXYZ'
};

export const Denied: Story<Props> = Template.bind({});
Denied.args = {
    ...Basic.args,
    permission: 'denied'
};

export const AnyDenied: Story<Props> = Template.bind({});
AnyDenied.args = {
    ...Basic.args,
    permission: ['denied', 'granted']
};
