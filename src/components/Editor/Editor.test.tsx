import React from 'react';

import { render } from '../test';
import Editor from './index';

describe('<Editor />', () => {
    it('render equals snapshot', () => {
        const { getByTestId } = render(<Editor fields={[]} cards={[]} onSubmit={data => {}}/>);
        expect(getByTestId('ut-front-test')).toMatchSnapshot();
    });
});
