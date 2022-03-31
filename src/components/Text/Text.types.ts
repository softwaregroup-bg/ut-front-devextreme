import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLSpanElement> {
    prefix?: string;
    params?: {};
    interpolate: () => string
}

export type StyledType = React.FC<Props>
