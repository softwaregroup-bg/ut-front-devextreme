import React from 'react';

import { render } from '../test';
import { Basic, Loading, Design, Tabs } from './Editor.stories';
import {CascadedDropdowns} from './stories/CascadedDropdowns.stories';
import {CascadedTables} from './stories/CascadedTables.stories';
import {CustomEditors} from './stories/CustomEditors.stories';
import {MasterDetail} from './stories/MasterDetail.stories';
import {MasterDetailPolymorphic} from './stories/MasterDetailPolymorphic.stories';
import {Pivot} from './stories/Pivot.stories';
import {PolymorphicLayout} from './stories/PolymorphicLayout.stories';
import {ResponsiveLayout} from './stories/ResponsiveLayout.stories';
import {TabbedLayout} from './stories/TabbedLayout.stories';
import {ThumbIndexLayout} from './stories/ThumbIndexLayout.stories';

describe('<Editor />', () => {
    it('Basic render equals snapshot', async() => {
        const { findByTestId } = render(<Basic {...Basic.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Loading render equals snapshot', async() => {
        const { findByTestId } = render(<Loading {...Loading.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Design render equals snapshot', async() => {
        const { findByTestId } = render(<Design {...Design.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Tabs render equals snapshot', async() => {
        const { findByTestId } = render(<Tabs {...Tabs.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('CascadedDropdowns render equals snapshot', async() => {
        const { findByTestId } = render(<CascadedDropdowns />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('CascadedTables render equals snapshot', async() => {
        const { findByTestId } = render(<CascadedTables />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('CustomEditors render equals snapshot', async() => {
        const { findByTestId } = render(<CustomEditors />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('MasterDetail render equals snapshot', async() => {
        const { findByTestId } = render(<MasterDetail />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('MasterDetailPolymorphic render equals snapshot', async() => {
        const { findByTestId } = render(<MasterDetailPolymorphic />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Pivot render equals snapshot', async() => {
        const { findByTestId } = render(<Pivot />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('PolymorphicLayout render equals snapshot', async() => {
        const { findByTestId } = render(<PolymorphicLayout />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('ResponsiveLayout render equals snapshot', async() => {
        const { findByTestId } = render(<ResponsiveLayout />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('TabbedLayout render equals snapshot', async() => {
        const { findByTestId } = render(<TabbedLayout />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('ThumbIndexLayout render equals snapshot', async() => {
        const { findByTestId } = render(<ThumbIndexLayout />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
});
